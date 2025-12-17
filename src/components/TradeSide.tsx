import { useState, useMemo } from 'react'
import { X, MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Player } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface TradeSideProps {
  title: string
  players: Player[]
  totalValue: number
  onRemovePlayer: (playerId: string) => void
  onAddPlayer: (player: Player) => void
  allPlayers: Player[]
  selectedPlayerIds: Set<string>
  highlight?: 'winning' | 'losing' | 'neutral'
}

export function TradeSide({ 
  title, 
  players, 
  totalValue, 
  onRemovePlayer, 
  onAddPlayer,
  allPlayers,
  selectedPlayerIds,
  highlight = 'neutral' 
}: TradeSideProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return allPlayers.slice(0, 50)
    
    const searchLower = search.toLowerCase()
    return allPlayers
      .filter(p => p.name.toLowerCase().includes(searchLower))
      .slice(0, 50)
  }, [allPlayers, search])

  const handleAddPlayer = (player: Player) => {
    onAddPlayer(player)
    setSearch('')
  }

  return (
    <Card className={`p-6 transition-all ${
      highlight === 'winning' ? 'ring-2 ring-success shadow-lg' :
      highlight === 'losing' ? 'ring-2 ring-destructive/50' :
      ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-0.5">Total Value</p>
          <p className="text-2xl font-bold font-mono tracking-tight">
            {totalValue.toFixed(1)}
          </p>
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full mb-4 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="mr-2" size={16} />
            Add Player
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <MagnifyingGlass 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                size={16}
              />
              <Input
                placeholder="Search players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="p-2 space-y-1">
              {filteredPlayers.map((player) => {
                const isSelected = selectedPlayerIds.has(player.id)
                
                return (
                  <button
                    key={player.id}
                    onClick={() => !isSelected && handleAddPlayer(player)}
                    disabled={isSelected}
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      isSelected 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-accent/50 cursor-pointer'
                    }`}
                  >
                    <p className="font-medium text-sm truncate">{player.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className="text-xs font-mono bg-accent/10 text-accent border-accent/30"
                      >
                        NB10: {player.nb10.toFixed(1)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs font-mono"
                      >
                        Value: {player.valueScore.toFixed(1)}
                      </Badge>
                    </div>
                  </button>
                )
              })}
              
              {filteredPlayers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No players found
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <div className="space-y-2 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {players.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[300px] text-muted-foreground text-sm"
            >
              No players added yet
            </motion.div>
          ) : (
            players.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <Card className="p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate mb-1">{player.name}</p>
                      <div className="flex gap-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs font-mono bg-accent/10 text-accent border-accent/30"
                        >
                          NB10: {player.nb10.toFixed(1)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="text-xs font-mono"
                        >
                          Value: {player.valueScore.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemovePlayer(player.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all hover:scale-110"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
