import zod from 'zod'

const paginationSchema = zod.object({
  page: zod.number().int().positive().default(1),
  limit: zod.number().int().positive().default(10)
})

export const validatePagination = (object) => {
  return paginationSchema.safeParse(object)
}
