import { z } from 'zod'

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const GetOrder400ErrorSchema = z.object({
  id: z.uuid(),
  message: z.string(),
})
export type GetOrder400Error = z.infer<typeof GetOrder400ErrorSchema>

export const GetOrder405ErrorSchema = z.object({
  timestamp: z.string(),
  status: z.number(),
  error: z.string(),
  path: z.string(),
})

export type GetOrder405Error = z.infer<typeof GetOrder405ErrorSchema>

export const TokenSchema = z.string()

export const CreateOrderRequestSchema = z.object({
  status: z.string(),
  courierId: z.number().nullable(),
  customerName: z.string(),
  customerPhone: z.string(),
  comment: z.string(),
})

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>

export const GetOrderSchema = z
  .object({
    status: z.string(),
    courierId: z.number().nullable(),
    customerName: z.string(),
    customerPhone: z.string(),
    comment: z.string(),
    id: z.number(),
  })
  .strict()

export type GetOrder = z.infer<typeof GetOrderSchema>

export const GetOrderWithTimeSchema = z.object({
  order: z.object({
    status: z.string(),
    courierId: z.number().nullable(),
    customerName: z.string(),
    customerPhone: z.string(),
    comment: z.string(),
    id: z.number(),
  }),
  currentDateTime: z.string(),
})

export type GetOrderWithTime = z.infer<typeof GetOrderWithTimeSchema>
export const GetOrderWithPaymentSchema = z.object({
  order: z.object({
    status: z.string(),
    courierId: z.number().nullable(),
    customerName: z.string(),
    customerPhone: z.string(),
    comment: z.string(),
    id: z.number(),
  }),
  payment: z.boolean(),
})
export type GetOrderWithPayment = z.infer<typeof GetOrderWithPaymentSchema>

export const GetAPIKey = z.object({
  message: z.string(),
  apiKey: z.string(),
})
export type APIKey = z.infer<typeof GetAPIKey>

export const GetAPIKey500Error = z.object({
  message: z.string(),
  apiKey: z.string().nullable(),
})
export type APIKey500Error = z.infer<typeof GetAPIKey500Error>