import { Scales, TrendUp, TrendDown } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface TradeSummaryProps {
  teamAValue: number
  teamBValue: number
  onClearTrade: () => void
}

export function TradeSummary({ teamAValue, teamBValue, onClearTrade }: TradeSummaryProps) {
  const difference = Math.abs(teamAValue - teamBValue)
  const teamAWinning = teamAValue > teamBValue
  const isBalanced = difference < 0.5

  return (
    <Card className="p-6 bg-primary text-primary-foreground">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <Scales size={24} weight="bold" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Trade Analysis</p>
            <div className="flex items-center gap-2">
              {isBalanced ? (
                <motion.p
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold tracking-tight"
                >
                  Balanced Trade
                </motion.p>
              ) : (
                <>
                  <motion.p
                    key={teamAWinning ? 'A' : 'B'}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold tracking-tight"
                  >
                    Team {teamAWinning ? 'A' : 'B'} Wins
                  </motion.p>
                  {teamAWinning ? (
                    <TrendUp size={24} weight="bold" />
                  ) : (
                    <TrendDown size={24} weight="bold" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-1">Difference</p>
            <motion.p
              key={difference}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-3xl font-bold font-mono tracking-tight"
            >
              {difference.toFixed(1)}
            </motion.p>
          </div>
          
          <Button
            variant="secondary"
            onClick={onClearTrade}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            Clear Trade
          </Button>
        </div>
      </div>
    </Card>
  )
}
