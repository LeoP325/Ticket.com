export interface OrderItem {
  eventTitle: string
  seatLabel: string
  price: number
  quantity: number
}

export interface Order {
  _id: string
  orderNo: string
  status: 'paid' | 'cancelled' | 'refunded'
  totalAmount: number
  items: OrderItem[]
  createdAt: string
}
