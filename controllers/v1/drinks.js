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

    const worksheet = workbook.getWorksheet('Data')
    const data = []

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i)
      // eslint-disable-next-line no-unused-vars
      const [_, name, brand, alcoholicGrade, content, packageData, category, subCategory, madeIn, variety, bitterness, strain, vineyard] = row.values
      const drinkValid = validateDrink({ name, brand, alcoholic_grade: alcoholicGrade, content, package: packageData, category, sub_category: subCategory, made_in: madeIn, variety, bitterness, strain, vineyard })
      if (drinkValid.error) continue

      const drinkExists = await DrinkModel.findOne({
        name: drinkValid.data.name,
        brand: drinkValid.data.brand,
        alcoholic_grade: drinkValid.data.alcoholic_grade,
        content: drinkValid.data.content,
        package: drinkValid.data.package
      })
      if (drinkExists) continue

      data.push(drinkValid.data)
    }

    const drinksAdded = await DrinkModel.insertMany(data)
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
