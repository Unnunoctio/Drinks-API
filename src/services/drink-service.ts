import DrinkModel, { type MDrink } from '../models/drink-model'
import type { IDrink, UDrink } from '../types'

const findDrinks = async (): Promise<IDrink[]> => {
  return await DrinkModel.find({}, { _id: 0, createdAt: 0, updatedAt: 0 }).lean().exec()
}

const saveManyDrinks = async (drinks: IDrink[]): Promise<MDrink[]> => {
  const filtered = (await Promise.all(drinks.map(async (d) => {
    const isExists = await DrinkModel.exists({ name: d.name, brand: d.brand, alcoholicGrade: d.alcoholicGrade, package: d.package })
    if (isExists !== null) return null
    return d
  }))).filter((d) => d !== null)

  const drinksAdded = await DrinkModel.insertMany(filtered)
  return drinksAdded
}

const updateManyDrinks = async (drinks: UDrink[]): Promise<void> => {
  // await DrinkModel.insertMany(drinks)
}

export const drinkService = {
  findDrinks,
  saveManyDrinks,
  updateManyDrinks
}
