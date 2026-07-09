import { OrderDto } from './order-dto'

export class OrderPaymentDto {
  order: OrderDto
  payment: string

  constructor(order: OrderDto, payment: string) {
    this.order = order
    this.payment = payment
  }
}
