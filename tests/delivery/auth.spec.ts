import { expect, test } from '@playwright/test'
import { Login } from '../../dto/login-dto'
import { createOrder, fetchJwt } from '../../helpers/api-helper'
import { GetOrder400ErrorSchema } from '../../dto/validation-schemas'

let loginDto: Login
export const baseUrl = 'https://backend.tallinn-learning.ee'
export const loginEndpoint = '/login/student'
export const ordersEndpoint = '/orders'

//unskip when ready to use
test.describe('Authorization flow', () => {
  test.beforeAll(() => {
    loginDto = new Login(process.env['DL_USERNAME']!, process.env['DL_PASSWORD']!)
  })

  test('should login and receive authorization token', async ({ request }) => {
    const token = await fetchJwt(request, loginDto)
    expect(token).toBeDefined()
  })

  test('should create order', async ({ request }) => {
    const token = await fetchJwt(request, loginDto)
    const orderId = await createOrder(request, token)
    expect(orderId).toBeDefined()
  })

  test('should get orders with authorization token', async ({ request }) => {
    const token = await fetchJwt(request, loginDto)

    const response = await request.get(baseUrl + ordersEndpoint, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.status()).toBe(200)
    const orders = await response.json()
    console.log('Orders:', JSON.stringify(orders, null, 2))
    expect(orders).toBeTruthy()
  })
  test.skip('should not login with incorrect password', async ({ request }) => {
    const response = await request.post(baseUrl + loginEndpoint, {
      data: new Login(loginDto.username, 'wrong-password'),
    })
    const responseBody = await response.json()
    expect(response.status()).toBe(401)
    GetOrder400ErrorSchema.parse(responseBody)
  })
})
