import path from 'path'
import { Hono } from 'hono'
import * as XLSX from 'xlsx'
import { drinkService } from '../services/drink-service'
import { validateDrink, validatePagination } from '../validations'
import { parseQuery } from '../helper/query'
import { verifyApiKey } from '../middlewares/api-key'
import { CATEGORY, PACKAGING, STRAIN, SUB_CATEGORY, VARIETY } from '../enum'

const route = new Hono()

route.get('/drinks', async (c) => {
  try {
    const query = parseQuery(c)
    const pagination = validatePagination(query)
    if (pagination.error !== undefined) return c.json({ error: pagination.error.issues }, 400)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await drinkService.findDrinks()
    return c.json({
      data: drinks.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(drinks.length / limit),
        totalItems: drinks.length
      }
    }, 200)
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

route.get('/drinks/excel/:category', async (c) => {
  try {
    const category = c.req.param('category')
    if (category === undefined) return c.json({ error: 'Category is required' }, 400)
    if (CATEGORY.includes(category) === false) return c.json({ error: { path: 'category', message: 'Invalid category', values: CATEGORY } }, 400)

    const drinksByCategory = await drinkService.findDrinksByCategory(category)
    drinksByCategory.sort((a, b) => a.brand.localeCompare(b.brand))

    const workbook = XLSX.utils.book_new()

    // TODO: worksheet values
    const data = [
      ['category', ...CATEGORY],
      ['subCategory', ...SUB_CATEGORY],
      ['packaging', ...PACKAGING],
      ['variety', ...VARIETY],
      ['strain', ...STRAIN]
    ]
    const worksheetValues = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheetValues, 'Valores')

    // TODO: worksheet template
    const worksheetTemplate = XLSX.utils.aoa_to_sheet([['_id', 'name', 'brand', 'abv', 'volume', 'packaging', 'category', 'subCategory', 'origin', 'variety', 'ibu', 'servingTemp', 'strain', 'vineyard']])
    XLSX.utils.book_append_sheet(workbook, worksheetTemplate, 'Template')

    // TODO: worksheet by brand
    const drinksByBrand = Object.groupBy(drinksByCategory, ({ brand }) => brand.toLowerCase().replaceAll('/', '-'))
    Object.keys(drinksByBrand).forEach((brand) => {
      const drinks = drinksByBrand[brand]
      if (drinks === undefined) return

      const worksheet = XLSX.utils.json_to_sheet(drinks)
      XLSX.utils.book_append_sheet(workbook, worksheet, brand)
    })

    // TODO: Create excel file
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    let filename = 'DRINKS-API-'
    if (category === 'Cervezas') filename += 'BEERS'
    if (category === 'Vinos') filename += 'WINES'
    if (category === 'Destilados') filename += 'SPIRITS'

    c.res.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    c.res.headers.set('Content-Disposition', `attachment; filename=${filename}.xlsx`)

    return c.body(buffer)
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

route.post('/drinks/excel', verifyApiKey, async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body.file
    if (!file || !(file instanceof File)) return c.json({ error: 'No file provided' }, 400)

    const extension = path.extname(file.name)
    if (['.xlsx', '.xls', '.csv'].includes(extension) === false) return c.json({ error: 'Invalid file type' }, 400)

    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'buffer' })
    const sheetNames = workbook.SheetNames

    const newDrinks = []
    const updateDrinks = []

    for (const sheetName of sheetNames) {
      if (sheetName === 'Valores' || sheetName === 'Template') continue
      const worksheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json(worksheet)
      for (const data of sheetData) {
        const { _id, name, brand, abv, volume, packaging, category, subCategory, origin, variety, ibu, servingTemp, strain, vineyard } = data
        const drink = validateDrink({ name, brand, abv, volume, packaging, category, subCategory, origin, variety, ibu, servingTemp, strain, vineyard })
        if (drink.error !== undefined) continue

        if (_id !== undefined) updateDrinks.push({ _id, ...drink.data })
        else newDrinks.push(drink.data)
      }
    }

    const updatedCount = await drinkService.updateManyDrinks(updateDrinks)
    const addedCount = await drinkService.saveManyDrinks(newDrinks)

    return c.json({
      data: {
        drinksAdded: addedCount,
        drinksAddedError: (newDrinks.length - addedCount),
        drinksUpdated: updatedCount,
        drinksUpdatedError: (updateDrinks.length - updatedCount)
      }
    }, 200)
  } catch (error) {
    c.json({ error: error.message }, 500)
  }
})

export default route
