import zod from 'zod'
import { Category, Package, Strain, SubCategory, Variety } from '../enums.js'

const drinkSchema = zod.object({
  name: zod.string(),
  brand: zod.string(),
  alcoholic_grade: zod.number().min(0),
  content: zod.number().int().positive(),
  package: zod.enum(Object.values(Package)),
  category: zod.enum(Object.values(Category)),
  sub_category: zod.enum(Object.values(SubCategory)),
  made_in: zod.string().optional()
})

const beerDrinkSchema = drinkSchema.extend({
  variety: zod.enum(Object.values(Variety)).optional(),
  bitterness: zod.string().optional()
})

const WineDrinkSchema = drinkSchema.extend({
  strain: zod.enum(Object.values(Strain)).optional(),
  vineyard: zod.string().optional()
})

export const validatePartialQueryDrink = (object) => {
  return drinkSchema.omit({ made_in: true }).partial().safeParse(object)
}

export const validateDrink = (object) => {
  const genericValidation = drinkSchema.safeParse(object)
  if (genericValidation.error) return genericValidation

  const { category } = genericValidation.data
  if (category === Category.CERVEZAS) return beerDrinkSchema.safeParse(object)
  if (category === Category.VINOS) return WineDrinkSchema.safeParse(object)

  return genericValidation
}

export const validatePartialDrink = (object) => {
  return drinkSchema.partial().safeParse(object)
}

export const validatePartialBeerDrink = (object) => {
  return beerDrinkSchema.partial().safeParse(object)
}

export const validatePartialWineDrink = (object) => {
  return WineDrinkSchema.partial().safeParse(object)
}
