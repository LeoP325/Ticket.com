export type SeatStatus
  = 'available' | 'held' | 'booked' | 'mine-held' | 'mine-booked'

export interface Seat {
  number: number
  status: SeatStatus
  heldUntil?: string
}

export interface TicketState {
  activeSelectors: number
  maxSelectors: number
  seats: Seat[]
}

export interface RaffleEntry {
  _id: string
  quantity: number
  status: 'pending' | 'won' | 'lost'
  seatLabels: string[]
}

export interface RaffleState {
  entry: RaffleEntry | null
  registeredPeople: number
  capacity: number
  drawDate: string
  drawnAt?: string
  winnerAccounts?: string[]
}
