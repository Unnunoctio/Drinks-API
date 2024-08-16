import z from 'zod'

const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(0).default(10)
})

export const validatePagination = (data) => {
  return paginationSchema.safeParse(data)
}
