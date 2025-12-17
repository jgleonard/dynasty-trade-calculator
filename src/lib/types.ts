export interface Player {
  id: string
  name: string
  nb10: number
  ppg?: number
  valueScore: number
  [key: string]: any
}

export type TradeTeam = 'teamA' | 'teamB'

export interface TradeState {
  teamA: Player[]
  teamB: Player[]
}
