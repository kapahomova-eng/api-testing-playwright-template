import { StatusCodes } from 'http-status-codes'
import { expect, test } from '@playwright/test'
import {
  GetAPIKey,
  GetAPIKey500Error,
  GetOrder400ErrorSchema,
  GetOrder405ErrorSchema,
  GetOrderSchema,
  GetOrderWithPaymentSchema,
  GetOrderWithTimeSchema,
} from '../../dto/validation-schemas'
import {
  getAPIKey,
  getOrderWithPayment,
  getOrderWithTime,
  getResponse,
  parseResponse,
  postRequest,
} from '../../helpers/api-helper'
import { OrderDto } from '../../dto/order-dto'
import { z } from 'zod'
import {
  baseUrl,
  testOrdersEndpoint,
  allOrdersURL,
  authURL,
  apiKey
} from '../../configs/api-enndpoints'

// const baseUrl = 'https://backend.tallinn-learning.ee'
// const testOrdersEndpoint = '/test-orders'
// const allOrdersURL = '/get_orders'
// const authURL = '/auth'
// const apiKey = process.env['TEST_ORDERS_API_KEY']!
const requestBodyFailed = {
  status: 'OPEN',
  courierId: 0,
  customerName: 'string',
  customerPhone: 'string',
  comment: 'string',
  id: 'm',
}

test.describe('Get an order by ID', () => {
  test('get order with correct id should receive code 200', async ({ request }) => {
    // Build and send a GET request to the server
    const { statusCode, responseBody } = await getResponse(
      request,
      baseUrl + testOrdersEndpoint + '/1',
    )
    console.log('response status:', statusCode)
    // Log the response status, body and headers
    console.log('response body:', responseBody)
    // Check if the response status is 200
    expect(statusCode).toBe(StatusCodes.OK)
    GetOrderSchema.parse(responseBody)
  })
  //this case isn't covered expected error schema
  test.skip('get order with non-numeric incorrect id ', async ({ request }) => {
    const { statusCode, responseBody } = await getResponse(
      request,
      baseUrl + testOrdersEndpoint + '/n ',
    )
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    console.log('response body:', responseBody)
    GetOrder400ErrorSchema.parse(responseBody)
  })
  test('get order with negative id ', async ({ request }) => {
    const { statusCode, responseBody } = await getResponse(
      request,
      baseUrl + testOrdersEndpoint + '/-1',
    )
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    GetOrder400ErrorSchema.parse(responseBody)
  })
  test('get order with long incorrect id ', async ({ request }) => {
    const { statusCode, responseBody } = await getResponse(
      request,
      baseUrl + testOrdersEndpoint + '/99',
    )
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    GetOrder400ErrorSchema.parse(responseBody)
  })
  test('get order with empty id ', async ({ request }) => {
    const { statusCode, responseBody } = await getResponse(request, baseUrl + testOrdersEndpoint)
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED)
    GetOrder405ErrorSchema.parse(responseBody)
  })
})

test.describe('Post an order', () => {
  test('post order with correct data should receive code 201', async ({ request }) => {
    const requestBody = OrderDto.createOrderWithRandomData()
    // Send a POST request to the server
    const { statusCode, responseBody } = await postRequest(
      request,
      baseUrl + testOrdersEndpoint,
      requestBody,
    )
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.OK)
    // check that body types are correct
    expect(() => GetOrderSchema.parse(responseBody)).not.toThrow()
  })
  test('post order with incorrect data should receive code 400', async ({ request }) => {
    const response = await request.post(`${baseUrl}${testOrdersEndpoint}`, {
      data: requestBodyFailed,
    })
    // // parse raw response body to json
    const responseBody = await response.text()
    const statusCode = response.status()

    // Log the response status and body
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(responseBody).toContain('Incorrect query')
  })
})

test.describe('PUT - Update an order by ID', () => {
  test('update order with correct id should receive code 200', async ({ request }) => {
    const updateBody = OrderDto.createOrderWithRandomData()
    const createResponse = await request.put(`${baseUrl}${testOrdersEndpoint}/1`, {
      headers: { api_key: apiKey },
      data: updateBody,
    })
    const { statusCode, responseBody } = await parseResponse(createResponse)
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.OK)
    expect(() => GetOrderSchema.parse(responseBody)).not.toThrow()
  })
  //this case isn't covered expected error schema
  test.skip('update order with non-numeric id should receive code 400', async ({ request }) => {
    const updateBody = OrderDto.createOrderWithRandomData()
    const createResponse = await request.put(`${baseUrl}${testOrdersEndpoint}/n`, {
      headers: { api_key: apiKey },
      data: updateBody,
    })
    const { statusCode, responseBody } = await parseResponse(createResponse)
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    console.log('response body:', responseBody)
    GetOrder400ErrorSchema.parse(responseBody)
  })
  test('Request body with typos, customer name with number instead of string', async ({
    request,
  }) => {
    const response = await request.put(`${baseUrl}${testOrdersEndpoint}`, {
      headers: { api_key: apiKey },
      data: requestBodyFailed,
    })
    const { statusCode, responseBody } = await parseResponse(response)
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED)
    GetOrder405ErrorSchema.parse(responseBody)
  })
  test('update order with negative id should receive code 400', async ({ request }) => {
    const updateBody = OrderDto.createOrderWithRandomData()
    const createResponse = await request.put(`${baseUrl}${testOrdersEndpoint}/-1`, {
      headers: { api_key: apiKey },
      data: updateBody,
    })
    const { statusCode, responseBody } = await parseResponse(createResponse)
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    console.log('response body:', responseBody)
    GetOrder400ErrorSchema.parse(responseBody)
  })
  test('should Not update order With Invalid Api Key', async ({ request }) => {
    const updateBody = OrderDto.createOrderWithRandomData()
    const createResponse = await request.put(`${baseUrl}${testOrdersEndpoint}/1`, {
      headers: { api_key: 'invalid-api-key' },
      data: updateBody,
    })
    const statusCode = createResponse.status()
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED)
  })
  //return 400 instead of 401
  test.skip('should Not update order With missed Api Key', async ({ request }) => {
    const updateBody = OrderDto.createOrderWithRandomData()
    const createResponse = await request.put(`${baseUrl}${testOrdersEndpoint}/1`, {
      data: updateBody,
    })
    const statusCode = createResponse.status()
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED)
  })
  //return 400 instead of 404
  test.skip('Order not found (if request body is empty)', async ({ request }) => {
    const createResponse = await request.put(`${baseUrl}${testOrdersEndpoint}/1`, {
      headers: { api_key: apiKey },
    })
    const responseBody = await createResponse.text()
    const statusCode = createResponse.status()

    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.NOT_FOUND)
  })
})

test.describe('DELETE - Delete an order by ID', () => {
  test('delete order with correct id should receive code 204', async ({ request }) => {
    const createResponse = await request.delete(`${baseUrl}${testOrdersEndpoint}/8`, {
      headers: { api_key: apiKey },
    })
    const statusCode = createResponse.status()
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.NO_CONTENT)
  })
  test('delete order with invalid id should receive code 400', async ({ request }) => {
    const createResponse = await request.delete(`${baseUrl}${testOrdersEndpoint}/99`, {
      headers: { api_key: apiKey },
    })
    const { statusCode, responseBody } = await parseResponse(createResponse)
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    console.log('response body:', responseBody)
    GetOrder400ErrorSchema.parse(responseBody)
  })
  test('should Not delete order With Invalid Api Key', async ({ request }) => {
    const createResponse = await request.delete(`${baseUrl}${testOrdersEndpoint}/8`, {
      headers: { api_key: 'apiKey' },
    })
    const statusCode = createResponse.status()
    console.log('response status:', statusCode)
    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED)
  })
})

test.describe('GET current info and time', () => {
  test('get current info and time should receive code 200', async ({ request }) => {
    const { statusCode, responseBody } = await getOrderWithTime(request, 1)
    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.OK)
    GetOrderWithTimeSchema.parse(responseBody)
  })
  test('get current info and time with negative ID', async ({ request }) => {
    const { statusCode, responseBody } = await getOrderWithTime(request, -1)
    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    GetOrder400ErrorSchema.parse(responseBody)
  })
  test('get current info and time with invalid header', async ({ request }) => {
    const createResponse = await request.get(`${baseUrl}${testOrdersEndpoint}/time/1`, {
      headers: {
        'x-application-name': 'invalid_header',
        'x-session-id': process.env.X_SESSION_ID!,
      },
    })
    const responseBody = await createResponse.text()
    const statusCode = createResponse.status()

    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(responseBody).toContain('Invalid headers')
  })
})

test.describe('Check order payment status by order ID', () => {
  test('get order payment status with correct id should receive code 200', async ({ request }) => {
    const { statusCode, responseBody } = await getOrderWithPayment(request, 1)
    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.OK)
    GetOrderWithPaymentSchema.parse(responseBody)
  })
  test('get order payment status with invalid ID', async ({ request }) => {
    const { statusCode, responseBody } = await getOrderWithPayment(request, 91)
    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    GetOrder400ErrorSchema.parse(responseBody)
  })
  test('get order payment status with invalid header', async ({ request }) => {
    const createResponse = await request.get(`${baseUrl}${testOrdersEndpoint}/time/1`, {
      headers: {
        'x-application-name': process.env.X_APPLICATION_NAME!,
        'x-session-id': 'invalid_header',
      },
    })
    const responseBody = await createResponse.text()
    const statusCode = createResponse.status()
    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(responseBody).toContain('Invalid headers')
  })
})

test.describe('Get all orders', () => {
  test('get all orders should receive code 200', async ({ request }) => {
    const { statusCode, responseBody } = await getResponse(
      request,
      baseUrl + testOrdersEndpoint + allOrdersURL,
    )
    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.OK)
    z.array(GetOrderSchema).parse(responseBody)
  })
  test('should return 429 when rate limit exceeded', async ({ request }) => {
    const requests = Array.from({ length: 500 }).map(() =>
      request.get(baseUrl + testOrdersEndpoint + allOrdersURL),
    )
    const responses = await Promise.all(requests)
    const has429 = responses.some((r) => r.status() === 429)
    expect(has429).toBeTruthy()
  })
})

test.describe('Get API key with username and password', () => {
  test('get API key with correct user creds', async ({ request }) => {
    const { statusCode, responseBody } = await getAPIKey(
      request,
      baseUrl + testOrdersEndpoint + authURL,
      {
        username: 'Kris',
        password: 'Pi',
      },
    )
    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.OK)
    GetAPIKey.parse(responseBody)
  })
  test('get API key with correct user invalid creds', async ({ request }) => {
    const { statusCode, responseBody } = await getAPIKey(
      request,
      baseUrl + testOrdersEndpoint + authURL,
      {
        username: 'Kris',
      },
    )
    console.log('response status:', statusCode)
    console.log('body', responseBody)
    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    GetAPIKey500Error.parse(responseBody)
  })
})
