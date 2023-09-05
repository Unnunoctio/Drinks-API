import DrinkModel from '../../models/DrinkModel.js'
import { validatePagination } from '../../zod/PaginationSchema.js'

export const getAllDrinks = async (req, res) => {
  try {
    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    // TODO: filters

    const drinks = await DrinkModel.find().skip(skip).limit(limit)
    res.status(200).sendResponse(drinks)
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}
