import z from 'zod'
import type { ZPagination } from '../types'

const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(0).default(10)
})

export const validatePagination = (data: unknown): z.SafeParseSuccess<ZPagination> | z.SafeParseError<unknown> => {
  return paginationSchema.safeParse(data)
}
