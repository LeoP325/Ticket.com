export type SeatStatus = 'available' | 'held' | 'booked' | 'mine-held' | 'mine-booked'

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
