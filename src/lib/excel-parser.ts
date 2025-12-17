import * as XLSX from 'xlsx'
import type { Player } from './types'

export interface ParseResult {
  success: boolean
  players?: Player[]
  error?: string
  skippedRows?: number
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          resolve({ success: false, error: 'Failed to read file' })
          return
        }

        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' })

        if (jsonData.length === 0) {
          resolve({ success: false, error: 'Spreadsheet is empty' })
          return
        }

        const firstRow = jsonData[0] as Record<string, any>
        const columns = Object.keys(firstRow)

        const nb10Column = columns.find(col => 
          col.toLowerCase().includes('nb10')
        )
        const valueColumn = columns.find(col => 
          col.toLowerCase().includes('value') && col.toLowerCase().includes('score')
        )
        const nameColumn = columns.find(col => 
          col.toLowerCase().includes('name') || col.toLowerCase().includes('player')
        ) || columns[0]

        if (!nb10Column) {
          resolve({ 
            success: false, 
            error: 'Missing required column: NB10. Please ensure your spreadsheet has a column containing "NB10"' 
          })
          return
        }

        if (!valueColumn) {
          resolve({ 
            success: false, 
            error: 'Missing required column: Value Score. Please ensure your spreadsheet has a column containing "Value Score"' 
          })
          return
        }

        const players: Player[] = []
        let skippedRows = 0

        jsonData.forEach((row: any, index) => {
          const name = String(row[nameColumn] || '').trim()
          const nb10 = parseFloat(row[nb10Column])
          const valueScore = parseFloat(row[valueColumn])

          if (!name || isNaN(nb10) || isNaN(valueScore)) {
            skippedRows++
            return
          }

          const ppgColumn = columns.find(col => 
            col.toLowerCase().includes('ppg') || col.toLowerCase().includes('point')
          )
          const ppg = ppgColumn ? parseFloat(row[ppgColumn]) : undefined

          players.push({
            id: `${name}-${index}`,
            name,
            nb10,
            ppg: isNaN(ppg!) ? undefined : ppg,
            valueScore,
          })
        })

        if (players.length === 0) {
          resolve({ 
            success: false, 
            error: `No valid players found. Skipped ${skippedRows} rows due to missing or invalid data` 
          })
          return
        }

        resolve({ 
          success: true, 
          players: players.sort((a, b) => b.valueScore - a.valueScore),
          skippedRows 
        })
      } catch (error) {
        resolve({ 
          success: false, 
          error: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}` 
        })
      }
    }

    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' })
    }

    reader.readAsBinaryString(file)
  })
}
