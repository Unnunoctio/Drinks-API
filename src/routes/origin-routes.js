import { Hono } from 'hono'
import { parseQuery } from '../helper/query'
import { validatePagination } from '../validations'
import { drinkService } from '../services/drink-service'
import { generatePath } from '../helper/path'

const route = new Hono()

route.get('/origins', async (c) => {
  try {
    const query = parseQuery(c)
    const pagination = validatePagination(query)
    if (pagination.error !== undefined) return c.json({ error: pagination.error.issues }, 400)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await drinkService.findDrinks()
    const countries = Object.groupBy(drinks, ({ origin }) => {
      const split = origin.split(', ')
      if (split.length > 1) return split[1]
      return origin
    })

    const countriesArray = Object.keys(countries).map(c => ({ origin: c, count: countries[c].length, path: `/${generatePath(c)}` }))
    countriesArray.sort((a, b) => a.origin.localeCompare(b.origin))
    return c.json({
      data: (limit === 0) ? countriesArray : countriesArray.slice(skip, skip + limit),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(countriesArray.length / limit),
        totalItems: countriesArray.length
      }
    }, 200)
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

route.get('/origins/:origin', async (c) => {
  try {
    const origin = c.req.param('origin')
    const query = parseQuery(c)
    const pagination = validatePagination(query)
    if (pagination.error !== undefined) return c.json({ error: pagination.error.issues }, 400)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await drinkService.findDrinks()

    const filteredDrinks = drinks.filter(d => {
      let country = d.origin
      const split = d.origin.split(', ')
      if (split.length > 1) country = split[1]

      return generatePath(country) === origin
    })
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
