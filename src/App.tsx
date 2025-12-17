import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { CheckCircle, WarningCircle, UploadSimple } from '@phosphor-icons/react'
import { Toaster, toast } from 'sonner'
import { FileUpload } from './components/FileUpload'
import { TradeSide } from './components/TradeSide'
import { TradeSummary } from './components/TradeSummary'
import { Alert, AlertDescription } from './components/ui/alert'
import { Button } from './components/ui/button'
import { parseExcelFile } from './lib/excel-parser'
import type { Player, TradeState } from './lib/types'

function App() {
  const [playersData, setPlayers] = useKV<Player[]>('dynasty-players', [])
  const players = playersData || []
  const [tradeState, setTradeState] = useState<TradeState>({
    teamA: [],
    teamB: []
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleFileSelect = async (file: File) => {
    setIsLoading(true)
    try {
      const result = await parseExcelFile(file)
      
      if (result.success && result.players) {
        setPlayers(result.players)
        toast.success(
          `Successfully loaded ${result.players.length} players${
            result.skippedRows ? ` (${result.skippedRows} rows skipped)` : ''
          }`
        )
      } else {
        toast.error(result.error || 'Failed to parse file')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPlayer = (player: Player, team: 'teamA' | 'teamB') => {
    setTradeState(prev => ({
      ...prev,
      [team]: [...prev[team], player]
    }))
  }

  const handleRemovePlayer = (playerId: string, team: 'teamA' | 'teamB') => {
    setTradeState(prev => ({
      ...prev,
      [team]: prev[team].filter(p => p.id !== playerId)
    }))
  }

  const handleClearTrade = () => {
    setTradeState({ teamA: [], teamB: [] })
    toast.info('Trade cleared')
  }

  const handleReloadData = () => {
    setPlayers([])
    setTradeState({ teamA: [], teamB: [] })
    toast.info('Data cleared - upload new spreadsheet')
  }

  const selectedPlayerIds = useMemo(() => {
    return new Set([
      ...tradeState.teamA.map(p => p.id),
      ...tradeState.teamB.map(p => p.id)
    ])
  }, [tradeState])

  const teamAValue = useMemo(() => 
    tradeState.teamA.reduce((sum, p) => sum + p.valueScore, 0),
    [tradeState.teamA]
  )

  const teamBValue = useMemo(() => 
    tradeState.teamB.reduce((sum, p) => sum + p.valueScore, 0),
    [tradeState.teamB]
  )

  const getHighlight = (isTeamA: boolean) => {
    const diff = Math.abs(teamAValue - teamBValue)
    if (diff < 0.5) return 'neutral'
    
    if (isTeamA) {
      return teamAValue > teamBValue ? 'winning' : 'losing'
    } else {
      return teamBValue > teamAValue ? 'winning' : 'losing'
    }
  }

  const hasActiveTrade = tradeState.teamA.length > 0 || tradeState.teamB.length > 0

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <div className="container mx-auto p-6 space-y-6">
        <header className="text-center space-y-2 pb-4 border-b">
          <h1 className="text-4xl font-bold tracking-tight">
            Dynasty Trade Calculator
          </h1>
          <p className="text-muted-foreground">
            Upload your player valuations and analyze trade scenarios
          </p>
        </header>

        {players.length === 0 ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
            
            <Alert>
              <WarningCircle className="h-4 w-4" />
              <AlertDescription>
                Your spreadsheet must include columns for: <strong>Player Name</strong>, <strong>NB10</strong>, and <strong>Value Score</strong>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <Alert className="bg-success/10 border-success text-success-foreground flex-1">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{players.length} players loaded.</strong> Add players to each team using the buttons below.
                </AlertDescription>
              </Alert>
              <Button 
                variant="outline" 
                onClick={handleReloadData}
                className="whitespace-nowrap"
              >
                <UploadSimple className="mr-2" size={16} />
                Upload New File
              </Button>
            </div>

            {hasActiveTrade && (
              <TradeSummary
                teamAValue={teamAValue}
                teamBValue={teamBValue}
                onClearTrade={handleClearTrade}
              />
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <TradeSide
                title="Team A"
                players={tradeState.teamA}
                totalValue={teamAValue}
                onRemovePlayer={(id) => handleRemovePlayer(id, 'teamA')}
                onAddPlayer={(player) => handleAddPlayer(player, 'teamA')}
                allPlayers={players}
                selectedPlayerIds={selectedPlayerIds}
                highlight={getHighlight(true)}
              />
              <TradeSide
                title="Team B"
                players={tradeState.teamB}
                totalValue={teamBValue}
                onRemovePlayer={(id) => handleRemovePlayer(id, 'teamB')}
                onAddPlayer={(player) => handleAddPlayer(player, 'teamB')}
                allPlayers={players}
                selectedPlayerIds={selectedPlayerIds}
                highlight={getHighlight(false)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App