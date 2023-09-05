import DrinkModel from '../../models/DrinkModel.js'
import { validatePartialQueryDrink } from '../../zod/DrinkSchema.js'
import { validatePagination } from '../../zod/PaginationSchema.js'

export const getAllDrinks = async (req, res) => {
  try {
    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const filters = validatePartialQueryDrink(req.parsedQuery)
    if (filters.error) throw new Error(filters.error.message)

    const drinks = await DrinkModel.find(filters.data).skip(skip).limit(limit)
    res.status(200).sendResponse(drinks)
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const getDrinkById = async (req, res) => {
  try {
    const { id } = req.params

    const drink = await DrinkModel.findById(id)
    res.status(200).sendResponse(drink)
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}
