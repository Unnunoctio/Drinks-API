import DrinkModel from '../models/drink-model'
import type { IDrink } from '../types'

export const findDrinks = async (): Promise<IDrink[]> => {
  return await DrinkModel.find({}, { _id: 0, createdAt: 0, updatedAt: 0 }).lean().exec()
}
