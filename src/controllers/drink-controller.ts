import type { Request, Response } from 'express'
import path from 'path'
import { ZodError } from 'zod'
import { validatePagination } from '../validations/pagination-validation'
import { drinkService } from '../services/drink-service'
import * as XLSX from 'xlsx'
import type { IDrink, UDrink } from '../types'
import { validateDrink } from '../validations/drink-validation'

export const getDrinks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const pagination = validatePagination(req.parseQuery)
    if (pagination.error !== undefined) throw new ZodError(pagination.error.issues)

    const { page, limit } = pagination.data
    const drinks = await drinkService.findDrinks()

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

export const addManyDrinks = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (req.file === undefined) throw new Error('No file provided')

    const extension = path.extname(req.file.originalname)
    const validExtensions = ['.xlsx', '.xls', '.csv']
    if (!validExtensions.includes(extension)) throw new TypeError(JSON.stringify({ path: 'file', message: 'Invalid file extension', extensions: validExtensions }))

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const sheetNames = workbook.SheetNames

    const newDrinks: IDrink[] = []
    const updateDrinks: UDrink[] = []

    for (const sheetName of sheetNames) {
      if (sheetName === 'Valores' || sheetName === 'Template') continue
      const worksheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json<any>(worksheet)

      for (const data of sheetData) {
        const { _id, name, brand, grade, contents, package: pack, category, subCategory, madeIn, variety, bitterness, temperature, strain, vineyard } = data
        const contentsArray: number[] = contents.toString().split(',').map(Number).sort((a: number, b: number) => a - b)
        const drink = validateDrink({ name, brand, alcoholicGrade: grade, contents: contentsArray, package: pack, category, subCategory, madeIn, variety, bitterness, temperature, strain, vineyard })
        if (drink.error !== undefined) continue
        if (_id !== undefined) {
          updateDrinks.push({ _id, ...drink.data })
        } else {
          newDrinks.push(drink.data)
        }
      }
    }

    const drinksAdded = await drinkService.saveManyDrinks(newDrinks)

    return res.status(200).json({ data: { drinksAdded: drinksAdded.length } })
  } catch (error: any) {
    if (error instanceof TypeError) return res.status(400).json({ error: JSON.parse(error.message) })
    if (error instanceof Error) return res.status(400).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}
