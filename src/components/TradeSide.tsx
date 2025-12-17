import { X } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Player } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface TradeSideProps {
  title: string
  players: Player[]
  totalValue: number
  onRemovePlayer: (playerId: string) => void
  highlight?: 'winning' | 'losing' | 'neutral'
}

export function TradeSide({ title, players, totalValue, onRemovePlayer, highlight = 'neutral' }: TradeSideProps) {
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

      <div className="space-y-2 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {players.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[300px] text-muted-foreground text-sm"
            >
              Add players to this side
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
