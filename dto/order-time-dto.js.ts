import { OrderDto } from './order-dto'

export class OrderTimeDto {
  order: OrderDto
  currentDateTime: string

  constructor(order: OrderDto, currentDateTime: string) {
    this.order = order
    this.currentDateTime = currentDateTime
  }
}
