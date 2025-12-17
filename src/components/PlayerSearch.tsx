import { useState, useMemo } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Player, TradeTeam } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface PlayerSearchProps {
  players: Player[]
  onAddPlayer: (player: Player, team: TradeTeam) => void
  selectedPlayerIds: Set<string>
}

export function PlayerSearch({ players, onAddPlayer, selectedPlayerIds }: PlayerSearchProps) {
  const [search, setSearch] = useState('')

  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return players.slice(0, 50)
    
    const searchLower = search.toLowerCase()
    return players
      .filter(p => p.name.toLowerCase().includes(searchLower))
      .slice(0, 50)
  }, [players, search])

  return (
    <div className="space-y-3">
      <div className="relative">
        <MagnifyingGlass 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          size={18}
        />
        <Input
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 transition-all focus:ring-2"
        />
      </div>

      <ScrollArea className="h-[400px] rounded-lg border bg-card">
        <div className="p-2 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayerIds.has(player.id)
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <Card 
                    className={`p-3 transition-all ${
                      isSelected 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
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
                      </div>
                      
                      {!isSelected && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAddPlayer(player, 'teamA')}
                            className="text-xs transition-transform hover:scale-105 active:scale-95"
                          >
                            Team A
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAddPlayer(player, 'teamB')}
                            className="text-xs transition-transform hover:scale-105 active:scale-95"
                          >
                            Team B
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {filteredPlayers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No players found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
