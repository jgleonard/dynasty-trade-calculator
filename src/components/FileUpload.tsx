import { useRef, useState } from 'react'
import { UploadSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      onFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
        isDragOver 
          ? 'border-accent bg-accent/5 scale-[1.01]' 
          : 'border-border bg-card hover:border-accent/50'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
          isDragOver ? 'bg-accent/20' : 'bg-muted'
        )}>
          <UploadSimple 
            className={cn(
              'transition-colors',
              isDragOver ? 'text-accent' : 'text-muted-foreground'
            )} 
            size={32} 
          />
        </div>
        
        <div>
          <p className="text-lg font-medium mb-1">
            {isDragOver ? 'Drop your file here' : 'Upload Player Data'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your Excel file or click to browse
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            {isLoading ? 'Processing...' : 'Select File'}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground max-w-md">
          Required columns: Player Name, NB10, Value Score
        </p>
      </div>
    </div>
  )
}
