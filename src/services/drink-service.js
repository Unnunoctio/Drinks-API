import DrinkModel from '../models/drink-model'

const findDrinks = async () => {
  return await DrinkModel.find({}, { createdAt: 0, updatedAt: 0 }).lean().exec()
}

const findDrinksByCategory = async (category) => {
  return await DrinkModel.find({ category }, { createdAt: 0, updatedAt: 0 }).lean().exec()
}

const saveManyDrinks = async (drinks) => {
  const drinksAdded = await DrinkModel.insertMany(drinks)
  return drinksAdded.length
}

const updateManyDrinks = async (drinks) => {
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
