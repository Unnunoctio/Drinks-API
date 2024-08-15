import type { DrinkCategory } from '../enum'
import DrinkModel from '../models/drink-model'
import type { IDrink, UDrink } from '../types'

const findDrinks = async (): Promise<IDrink[]> => {
  return await DrinkModel.find({}, { _id: 0, createdAt: 0, updatedAt: 0 }).lean().exec()
}

const findDrinksByCategory = async (category: DrinkCategory): Promise<UDrink[]> => {
  return await DrinkModel.find({ category }, { createdAt: 0, updatedAt: 0 }).lean().exec()
}

const saveManyDrinks = async (drinks: IDrink[]): Promise<number> => {
  const filtered = (await Promise.all(drinks.map(async (d) => {
    const isExists = await DrinkModel.exists({ name: d.name, brand: d.brand, alcoholicGrade: d.alcoholicGrade, package: d.package })
    if (isExists !== null) return null
    return d
  }))).filter((d) => d !== null)

  const drinksAdded = await DrinkModel.insertMany(filtered)
  return drinksAdded.length
}

const updateManyDrinks = async (drinks: UDrink[]): Promise<number> => {
  const updateOperations = drinks.map(drink => ({
    updateOne: {
      filter: { _id: drink._id },
      update: { $set: drink },
      upsert: false
    }
  }))

  const drinksUpdated = await DrinkModel.bulkWrite(updateOperations)
  return drinksUpdated.modifiedCount
}

export const drinkService = {
  findDrinks,
  findDrinksByCategory,
  saveManyDrinks,
  updateManyDrinks
}
