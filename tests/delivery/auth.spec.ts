import { expect, test } from '@playwright/test'
import { Login } from '../../dto/login-dto'
import { createOrder, fetchJwt } from '../../helpers/api-helper'
import { GetOrder400ErrorSchema } from '../../dto/validation-schemas'
import { baseUrl, loginEndpoint, ordersEndpoint } from '../../configs/api-enndpoints'

let loginDto: Login
/*export const baseUrl = 'https://backend.tallinn-learning.ee'
export const loginEndpoint = '/login/student'
export const ordersEndpoint = '/orders'*/

//unskip when ready to use
test.beforeAll(() => {
  const username = process.env.DL_USERNAME
  const password = process.env.DL_PASSWORD

  console.log('DL_USERNAME is set:', Boolean(username))
  console.log('DL_PASSWORD is set:', Boolean(password))

  if (!username || !password) {
    throw new Error('DL_USERNAME or DL_PASSWORD is not defined')
  }

  loginDto = new Login(username, password)

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
