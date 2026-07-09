export class ProductDto {
  name: string
  price: number
  id: number | undefined
  createdAt: string | undefined

  constructor(
    name: string,
    price: number,
    id: number | undefined = undefined,
    createdAt: string | undefined = undefined,
  ) {
    this.name = name
    this.price = price
    this.id = id
    this.createdAt = createdAt
  }
}
