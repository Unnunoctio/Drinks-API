import { Hono } from 'hono'
import { parseQuery } from '../helper/query'
import { validatePagination } from '../validations'
import { drinkService } from '../services/drink-service'
import { generatePath } from '../helper/path'

const route = new Hono()

route.get('/brands', async (c) => {
  try {
    const query = parseQuery(c)
    const pagination = validatePagination(query)
    if (pagination.error !== undefined) return c.json({ error: pagination.error.issues }, 400)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await drinkService.findDrinks()
    const brands = Object.groupBy(drinks, ({ brand }) => brand)

    const brandsArray = Object.keys(brands).map(b => ({ brand: b, count: brands[b].length, path: `/${generatePath(b)}` }))
    brandsArray.sort((a, b) => a.brand.localeCompare(b.brand))
    return c.json({
      data: (limit === 0) ? brandsArray : brandsArray.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(brandsArray.length / limit),
        totalItems: brandsArray.length
      }
    }, 200)
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

route.get('/brands/:brand', async (c) => {
  try {
    const brand = c.req.param('brand')
    const query = parseQuery(c)
    const pagination = validatePagination(query)
    if (pagination.error !== undefined) return c.json({ error: pagination.error.issues }, 400)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await drinkService.findDrinks()

    const filteredDrinks = drinks.filter(d => generatePath(d.brand) === brand)
    filteredDrinks.sort((a, b) => a.name.localeCompare(b.name))
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
