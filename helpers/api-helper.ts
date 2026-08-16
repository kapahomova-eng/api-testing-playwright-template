import { APIRequestContext, APIResponse, expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { Login } from '../dto/login-dto'
import {
  baseUrl,
  loginEndpoint,
  ordersEndpoint,
  testOrdersEndpoint,
} from '../configs/api-enndpoints'

export async function fetchJwt(request: APIRequestContext, login: Login): Promise<string> {
  const url = baseUrl + loginEndpoint

  console.log('Authorization URL:', url)
  console.log('Username exists:', Boolean(login.username))
  console.log('Password exists:', Boolean(login.password))

  const authResponse = await request.post(url, {
    data: login,
  })

  console.log('Authorization status:', authResponse.status())

  if (authResponse.status() !== StatusCodes.OK) {
    const responseBody = await authResponse.text()
    console.log('Authorization response:', responseBody)

    throw new Error(`Authorization failed. Status: ${authResponse.status()}`)
  }

  return await authResponse.text()
}

export async function createOrder(request: APIRequestContext, jwt: string): Promise<number> {
  const response = await request.post(baseUrl + ordersEndpoint, {
    data: {
      status: 'OPEN',
      courierId: 0,
      customerName: 'vladimir',
      customerPhone: '55445566',
      comment: 'hello',
      id: 0,
    },
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  return responseBody.id
}

export async function getResponse(request: APIRequestContext, url: string) {
  const response = await request.get(url)

  return {
    response,
    statusCode: response.status(),
    responseBody: await response.json(),
  }
}

export async function postRequest(
  request: APIRequestContext,
  url: string,
  body: unknown,
): Promise<{
  response: APIResponse
  statusCode: number
  responseBody: unknown
}> {
  const response = await request.post(url, {
    data: body,
  })

  return {
    response,
    statusCode: response.status(),
    responseBody: await response.json(),
  }
}

export async function parseResponse(response: APIResponse) {
  return {
    statusCode: response.status(),
    responseBody: await response.json(),
  }
}

export async function getOrderWithTime(request: APIRequestContext, orderId: number) {
  const response = await request.get(`${baseUrl}${testOrdersEndpoint}/time/${orderId}`, {
    headers: {
      'x-application-name': process.env.X_APPLICATION_NAME!,
      'x-session-id': process.env.X_SESSION_ID!,
    },
  })

  return {
    response,
    statusCode: response.status(),
    responseBody: await response.json(),
  }
}

export async function getOrderWithPayment(request: APIRequestContext, orderId: number) {
  const response = await request.get(`${baseUrl}${testOrdersEndpoint}/payment/${orderId}`, {
    headers: {
      'x-application-name': process.env.X_APPLICATION_NAME!,
      'x-session-id': process.env.X_SESSION_ID!,
    },
  })

  return {
    response,
    statusCode: response.status(),
    responseBody: await response.json(),
  }
}
export async function getAPIKey(
  request: APIRequestContext,
  url: string,
  params: Record<string, string>,
): Promise<{
  response: APIResponse
  statusCode: number
  responseBody: unknown
}> {
  const response = await request.get(url, {
    params,
  })

  return {
    response,
    statusCode: response.status(),
    responseBody: await response.json(),
  }
}
// export async function getOrderById(
//   request: APIRequestContext,
//   jwt: string,
//   id: number,
// ): Promise<OrderDto> {
//   const response = await request.get(`${serviceURL}${orderPath}/${id}`, {
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//   })
//   expect(response.status()).toBe(StatusCodes.OK)
//   const data = await response.json()
//   return new OrderDto(
//     data.status,
//     data.courierId,
//     data.customerName,
//     data.customerPhone,
//     data.comment,
//     data.id,
//   )
// }
