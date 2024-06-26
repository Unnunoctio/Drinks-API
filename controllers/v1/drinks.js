import path from 'node:path'
import ExcelJS from 'exceljs'
import DrinkModel from '../../models/DrinkModel.js'
import { validateDrink, validatePartialBeerDrink, validatePartialDrink, validatePartialQueryDrink, validatePartialWineDrink } from '../../zod/DrinkSchema.js'
import { validatePagination } from '../../zod/PaginationSchema.js'
import { Category } from '../../enums.js'

export const getAllDrinks = async (req, res) => {
  try {
    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const filters = validatePartialQueryDrink(req.parsedQuery)
    if (filters.error) throw new Error(filters.error.message)

    let drinks = await DrinkModel.find(filters.data).lean()
    const count = drinks.length

    // sort drinks by name
    drinks.sort((a, b) => (a.brand !== b.brand) ? a.brand.localeCompare(b.brand) : a.name.localeCompare(b.name))
    if (limit > 0) drinks = drinks.slice(skip, skip + limit)

    res.status(200).sendResponse({
      count,
      page,
      limit,
      drinks: drinks.map(({ _id, __v, ...resto }) => resto)
    })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const addDrink = async (req, res) => {
  try {
    const drink = validateDrink(req.body)
    if (drink.error) throw new Error(drink.error.message)

    const newDrink = new DrinkModel(drink.data)
    await newDrink.save()
    res.status(201).sendResponse(newDrink)
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const addManyDrinks = async (req, res) => {
  try {
    if (!req.file) throw new Error(JSON.stringify({ message: 'No file provided' }))

    const extension = path.extname(req.file.originalname)
    const validExtensions = ['.xlsx', '.xls', '.csv']
    if (validExtensions.includes(extension) === false) throw new Error(JSON.stringify({ message: 'Invalid extension file', received: extension, options: validExtensions }))

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(req.file.buffer)

    const sheetNames = workbook.worksheets.map(worksheet => worksheet.name)

    const drinks = (await Promise.all(sheetNames.map(async sheetName => {
      const worksheet = workbook.getWorksheet(sheetName)

      const rowNumbers = Array.from({ length: worksheet.rowCount - 1 }, (_, i) => i + 2)
      return await Promise.all(rowNumbers.map(async rowNumber => {
        const row = worksheet.getRow(rowNumber)
        // eslint-disable-next-line no-unused-vars
        const [_, name, brand, alcoholicGrade, content, packageData, category, subCategory, madeIn, variety, bitterness, temperature, strain, vineyard] = row.values
        const drinkValid = validateDrink({ name, brand, alcoholic_grade: alcoholicGrade, content, package: packageData, category, sub_category: subCategory, made_in: madeIn, variety, bitterness, temperature, strain, vineyard })
        if (drinkValid.error) return null
        return drinkValid.data
      }))
    }))).flat().filter(drink => drink !== null)

    const dataDrinks = await Promise.all(drinks.map(async drink => {
      const drinkExists = await DrinkModel.findOne({
        name: drink.name,
        brand: drink.brand,
        alcoholic_grade: drink.alcoholic_grade,
        content: drink.content,
        package: drink.package
      })
      if (drinkExists) return null
      return drink
    }))

    const drinksAdded = await DrinkModel.insertMany(dataDrinks.filter(data => data !== null))
    res.status(201).sendResponse({ drinks_added: drinksAdded })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const modifyDrink = async (req, res) => {
  try {
    const { id } = req.params
    const drink = await DrinkModel.findById(id)
    if (!drink) return res.status(404).sendResponse({ error: { message: 'Drink not found' } })

    let drinkModification = {}
    if (drink.category === Category.CERVEZAS) drinkModification = validatePartialBeerDrink(req.body)
    else if (drink.category === Category.VINOS) drinkModification = validatePartialWineDrink(req.body)
    else drinkModification = validatePartialDrink(req.body)

    if (drinkModification.error) throw new Error(drinkModification.error.message)

    const drinkModified = await DrinkModel.findByIdAndUpdate(id, drinkModification.data, { new: true })
    res.status(200).sendResponse(drinkModified)
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const deleteDrink = async (req, res) => {
  try {
    const { id } = req.params
    const drink = await DrinkModel.findById(id)
    if (!drink) return res.status(404).sendResponse({ error: { message: 'Drink not found' } })

    await drink.deleteOne()
    res.status(200).sendResponse(drink)
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const deleteAllDrinks = async (req, res) => {
  try {
    await DrinkModel.deleteMany({})
    res.status(200).sendResponse({ message: 'All drinks deleted' })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}
