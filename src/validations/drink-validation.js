import { z } from 'zod'
import { CATEGORY, PACKAGING, STRAIN, SUB_CATEGORY, VARIETY } from '../enum'

const drinkSchema = z.object({
  name: z.string(),
  brand: z.string(),
  abv: z.number().min(0).max(100),
  volume: z.number().min(0),
  packaging: z.enum(PACKAGING),
  category: z.enum(CATEGORY),
  subCategory: z.enum(SUB_CATEGORY),
  origin: z.string()
})

const beerSchema = drinkSchema.extend({
  variety: z.enum(VARIETY).optional(),
  ibu: z.number().min(0).max(100).optional(),
  servingTemp: z.string().optional()
})

const wineSchema = drinkSchema.extend({
  strain: z.enum(STRAIN).optional(),
  vineyard: z.string().optional()
})

export const validateDrink = (data) => {
  const validation = drinkSchema.safeParse(data)
  if (validation.error !== undefined) return validation

  const { category } = validation.data
  if (category === 'Cervezas') return beerSchema.safeParse(data)
  if (category === 'Vinos') return wineSchema.safeParse(data)

  return validation
}
