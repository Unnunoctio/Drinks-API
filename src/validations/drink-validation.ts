import z from 'zod'
import type { IDrink } from '../types'
import { BeerVariety, DrinkCategory, DrinkPackage, DrinkSubCategory, WineStrain } from '../enum'

const drinkSchema = z.object({
  name: z.string(),
  brand: z.string(),
  alcoholicGrade: z.number().min(0),
  contents: z.array(z.number().positive()),
  package: z.nativeEnum(DrinkPackage),
  category: z.nativeEnum(DrinkCategory),
  subCategory: z.nativeEnum(DrinkSubCategory),
  madeIn: z.string()
})

const beerSchema = drinkSchema.extend({
  variety: z.nativeEnum(BeerVariety).optional(),
  bitterness: z.number().int().positive().min(0).optional(),
  temperature: z.string().optional()
})

const wineSchema = drinkSchema.extend({
  strain: z.nativeEnum(WineStrain).optional(),
  vineyard: z.string().optional()
})

export const validateDrink = (data: unknown): z.SafeParseSuccess<IDrink> | z.SafeParseError<unknown> => {
  const validation = drinkSchema.safeParse(data)
  if (validation.error !== undefined) return validation

  const { category } = validation.data
  if (category === DrinkCategory.CERVEZAS) return beerSchema.safeParse(data)
  if (category === DrinkCategory.VINOS) return wineSchema.safeParse(data)

  return validation
}
