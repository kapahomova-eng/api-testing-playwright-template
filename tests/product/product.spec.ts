import { StatusCodes } from 'http-status-codes'
import { expect, test } from '@playwright/test'
import { ProductDto } from '../../dto/product-dto'

const baseUrl = 'https://backend.tallinn-learning.ee'
const productsEndpoint = '/products'
const apiKey = process.env['PRODUCTS_API_KEY']!

test.describe('Product Operations', () => {
  test('should create new product and return product info', async ({ request }) => {
    const productDto = new ProductDto('Milk', 1)
    const createResponse = await request.post(baseUrl + productsEndpoint, {
      headers: { 'X-API-Key': apiKey },
      data: productDto,
    })
    console.log('productDto', productDto)
    const createdProduct = await createResponse.json()
    console.log('createdProduct', createdProduct)
    console.log(createdProduct.id)

    const response = await request.get(`${baseUrl}${productsEndpoint}/${createdProduct.id}`, {
      headers: { 'X-API-Key': apiKey },
    })
    console.log('body', await response.json())

    expect.soft(response.status()).toBe(StatusCodes.OK)
    const product = await response.json()
    expect.soft(product.id).toBe(createdProduct.id)
    expect.soft(product.name).toBe(createdProduct.name)
    expect.soft(product.price).toBe(createdProduct.price)
  })

  test('should Not Return Product With Invalid Api Key', async ({ request }) => {
    const response = await request.get(`${baseUrl}${productsEndpoint}/1`, {
      headers: { 'X-API-Key': 'invalid-api-key' },
    })

    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  })

  test('should Delete Product By Id', async ({ request }) => {
    const productDto = new ProductDto('Milk', 1)
    const createResponse = await request.post(baseUrl + productsEndpoint, {
      headers: { 'X-API-Key': apiKey },
      data: productDto,
    })
    const createdProduct = await createResponse.json()

    const deleteResponse = await request.delete(
      `${baseUrl}${productsEndpoint}/${createdProduct.id}`,
      { headers: { 'X-API-Key': apiKey } },
    )

    expect(deleteResponse.status()).toBe(StatusCodes.NO_CONTENT)

    const getResponse = await request.get(`${baseUrl}${productsEndpoint}/${createdProduct.id}`, {
      headers: { 'X-API-Key': apiKey },
    })
    expect(getResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('should Update Product By Id', async ({ request }) => {
    const productDto = new ProductDto('Milk', 1)
    const createResponse = await request.post(baseUrl + productsEndpoint, {
      headers: { 'X-API-Key': apiKey },
      data: productDto,
    })
    const createdProduct = await createResponse.json()

    const updatedProduct = new ProductDto('Updated product name', 12345)
    const response = await request.put(`${baseUrl}${productsEndpoint}/${createdProduct.id}`, {
      headers: { 'X-API-Key': apiKey },
      data: updatedProduct,
    })

    expect(response.status()).toBe(StatusCodes.OK)
    const product = await response.json()
    expect(product.id).toBe(createdProduct.id)
    expect(product.name).toBe(updatedProduct.name)
    expect(product.price).toBe(updatedProduct.price)
  })

  test('should Create Product', async ({ request }) => {
    const productDto = new ProductDto('Milk', 1)

    const response = await request.post(baseUrl + productsEndpoint, {
      headers: { 'X-API-Key': apiKey },
      data: productDto,
    })

    expect(response.status()).toBe(StatusCodes.OK)
    const product = await response.json()
    expect(product.id).toBeDefined()
    expect(product.name).toBe(productDto.name)
    expect(product.price).toBe(productDto.price)
  })

  test('Delete Non Existing Product', async ({ request }) => {
    const response = await request.delete(`${baseUrl}${productsEndpoint}/999999999`, {
      headers: { 'X-API-Key': apiKey },
    })

    expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
    const body = await response.text()
    expect(body).toContain('Product not found')
  })

  test('Find non existing Product', async ({ request }) => {
    const response = await request.get(`${baseUrl}${productsEndpoint}/999999999`, {
      headers: { 'X-API-Key': apiKey },
    })

    expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
    const body = await response.text()
    expect(body).toContain('Product not found')
  })

  test('Get all products', async ({ request }) => {
    const response = await request.get(baseUrl + productsEndpoint, {
      headers: { 'X-API-Key': apiKey },
    })

    expect(response.status()).toBe(StatusCodes.OK)
    const products = await response.json()
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
  })
})
