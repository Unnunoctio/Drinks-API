import { Hono } from 'hono'
import { parseQuery } from '../helper/query'
import { validatePagination } from '../validations'
import { drinkService } from '../services/drink-service'
import { generatePath } from '../helper/path'

const route = new Hono()

route.get('/categories', async (c) => {
  try {
    const query = parseQuery(c)
    const pagination = validatePagination(query)
    if (pagination.error !== undefined) return c.json({ error: pagination.error.issues }, 400)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await drinkService.findDrinks()
    const categories = Object.groupBy(drinks, ({ category }) => category)

    const categoriesArray = Object.keys(categories).map(cat => ({ category: cat, count: categories[cat].length, path: `/${generatePath(cat)}` }))
    categoriesArray.sort((a, b) => a.category.localeCompare(b.category))
    return c.json({
      data: (limit === 0) ? categoriesArray : categoriesArray.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(categoriesArray.length / limit),
        totalItems: categoriesArray.length
      }
    }, 200)
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

route.get('/categories/:category', async (c) => {
  try {
    const category = c.req.param('category')
    const query = parseQuery(c)
    const pagination = validatePagination(query)
    if (pagination.error !== undefined) return c.json({ error: pagination.error.issues }, 400)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await drinkService.findDrinks()
    const drinksByCategory = drinks.filter(d => generatePath(d.category) === category)
    const subCategories = Object.groupBy(drinksByCategory, ({ subCategory }) => subCategory)

    const subCategoriesArray = Object.keys(subCategories).map(sc => ({ subCategory: sc, count: subCategories[sc].length, path: `/${generatePath(sc)}` }))
    subCategoriesArray.sort((a, b) => a.subCategory.localeCompare(b.subCategory))
    return c.json({
      data: (limit === 0) ? subCategoriesArray : subCategoriesArray.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(subCategoriesArray.length / limit),
        totalItems: subCategoriesArray.length
      }
    }, 200)
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

route.get('/categories/:category/:subCategory', async (c) => {
  try {
    const category = c.req.param('category')
    const subCategory = c.req.param('subCategory')
    const query = parseQuery(c)
    const pagination = validatePagination(query)
    if (pagination.error !== undefined) return c.json({ error: pagination.error.issues }, 400)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await drinkService.findDrinks()
    const drinksByCategory = drinks.filter(d => generatePath(d.category) === category)

    const filteredDrinks = drinksByCategory.filter(d => generatePath(d.subCategory) === subCategory)
    filteredDrinks.sort((a, b) => (a.brand !== b.brand) ? a.brand.localeCompare(b.brand) : a.name.localeCompare(b.name))
    return c.json({
      data: (limit === 0) ? filteredDrinks : filteredDrinks.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(filteredDrinks.length / limit),
        totalItems: filteredDrinks.length
      }
    }, 200)
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

export default route
