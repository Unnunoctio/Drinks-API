import type { Request, Response } from 'express'
import path from 'path'
import { ZodError } from 'zod'
import { validatePagination } from '../validations/pagination-validation'
import { drinkService } from '../services/drink-service'
import * as XLSX from 'xlsx'
import type { IDrink, UDrink } from '../types'
import { validateDrink } from '../validations/drink-validation'
import { isValidCategory } from '../utils'
import { BeerVariety, DrinkCategory, DrinkPackage, DrinkSubCategory, WineStrain } from '../enum'

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

export const getManyDrinks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const category = req.parseQuery.category
    if (category === undefined) throw new Error('Category is required')
    if (!isValidCategory(category)) throw new TypeError(JSON.stringify({ path: 'category', message: 'Invalid category', values: Object.values(DrinkCategory) }))

    const drinksByCategory = await drinkService.findDrinksByCategory(category)

    const workbook = XLSX.utils.book_new()

    // TODO: worksheet values
    const data = [
      ['category:', category],
      ['subCategory:', ...Object.values(DrinkSubCategory)],
      ['package:', ...Object.values(DrinkPackage)]
    ]
    if (category === DrinkCategory.CERVEZAS) data.push(['variety:', ...Object.values(BeerVariety)])
    if (category === DrinkCategory.VINOS) data.push(['strain:', ...Object.values(WineStrain)])

    const worksheetValues = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheetValues, 'Valores')

    // TODO: worksheet by brand
    const drinksByBrand = Object.groupBy(drinksByCategory, ({ brand }) => brand.toLowerCase().replaceAll('/', '-'))
    Object.keys(drinksByBrand).forEach((brand) => {
      const drinks = drinksByBrand[brand]
      if (drinks === undefined) return

      const worksheetData = drinks.map((d) => {
        return { ...d, _id: d._id.toString(), contents: d.contents.join(', ') }
      }).sort((a, b) => a._id.localeCompare(b._id))

      const worksheet = XLSX.utils.json_to_sheet(worksheetData)
      XLSX.utils.book_append_sheet(workbook, worksheet, brand)
    })

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    let filename = 'DRINKS-API-'
    if (category === DrinkCategory.CERVEZAS) filename += 'BEERS'
    if (category === DrinkCategory.VINOS) filename += 'WINES'
    if (category === DrinkCategory.DESTILADOS) filename += 'SPIRITS'

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`)

    return res.send(buffer)
  } catch (error: any) {
    if (error instanceof TypeError) return res.status(400).json({ error: JSON.parse(error.message) })
    if (error instanceof Error) return res.status(400).json({ error: error.message })
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
        const { _id, name, brand, alcoholicGrade, contents, package: pack, category, subCategory, madeIn, variety, bitterness, temperature, strain, vineyard } = data
        const contentsArray: number[] = contents.toString().split(',').map(Number).sort((a: number, b: number) => a - b)
        const drink = validateDrink({ name, brand, alcoholicGrade, contents: contentsArray, package: pack, category, subCategory, madeIn, variety, bitterness, temperature, strain, vineyard })
        if (drink.error !== undefined) continue
        if (_id !== undefined) {
          updateDrinks.push({ _id, ...drink.data })
        } else {
          newDrinks.push(drink.data)
        }
      }
    }

    const updatedCount = await drinkService.updateManyDrinks(updateDrinks)
    const addedCount = await drinkService.saveManyDrinks(newDrinks)

    return res.status(200).json({
      data: {
        drinksAdded: addedCount,
        drinksAddedError: (newDrinks.length - addedCount),
        drinksUpdated: updatedCount,
        drinksUpdatedError: (updateDrinks.length - updatedCount)
      }
    })
  } catch (error: any) {
    if (error instanceof TypeError) return res.status(400).json({ error: JSON.parse(error.message) })
    if (error instanceof Error) return res.status(400).json({ error: error.message })
    return res.status(500).json({ error: error.message })
  }
}
