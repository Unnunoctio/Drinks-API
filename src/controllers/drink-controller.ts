import { ZodError } from 'zod'
import type { Request, Response } from 'express'
import { validatePagination } from '../validations/pagination-validation'
import { findDrinks } from '../services/drink-service'

export const getDrinks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const pagination = validatePagination(req.parseQuery)
    if (pagination.error !== undefined) throw new ZodError(pagination.error.issues)

    const { page, limit } = pagination.data
    const drinks = await findDrinks()

    return res.status(200).json({
      data: drinks,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(drinks.length / limit),
        totalItems: drinks.length
      }
    })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.issues.map((err) => { return { path: err.path[0], message: err.message } })
      })
    }
    return res.status(500).json({ error: error.message })
  }
}
