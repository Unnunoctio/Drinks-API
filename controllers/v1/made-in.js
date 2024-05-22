import DrinkModel from '../../models/DrinkModel.js'
import { validatePagination } from '../../zod/PaginationSchema.js'

const generatePath = (value) => {
  return value.toLowerCase().replaceAll(/[.°+]/g, '').replaceAll(' ', '-').replaceAll('/', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const getAllCountries = async (req, res) => {
  try {
    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await DrinkModel.find()
    // agrupar los drinks mediante su country
    const countries = drinks.reduce((acc, drink) => {
      let country = drink.made_in
      const split = drink.made_in.split(', ')
      if (split.length > 1) country = split[1]

      if (!acc[country]) acc[country] = []
      acc[country].push(drink)
      return acc
    }, {})

    let countriesArray = Object.keys(countries).map(country => ({ country, drinks: countries[country] })).sort((a, b) => a.country.localeCompare(b.country))
    const count = countriesArray.length

    if (limit > 0) { countriesArray = countriesArray.slice(skip, skip + limit) }
    const countriesFormat = countriesArray.map(country => ({ country: country.country, count: country.drinks.length, path: `/${generatePath(country.country)}` }))

    res.status(200).sendResponse({
      count,
      page,
      limit,
      countries: countriesFormat
    })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const getCountry = async (req, res) => {
  try {
    const { country } = req.params

    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await DrinkModel.find().lean()
    let drinksByCountry = drinks.filter(drink => {
      let drinkCountry = drink.made_in
      const split = drink.made_in.split(', ')
      if (split.length > 1) drinkCountry = split[1]

      return generatePath(drinkCountry) === country
    })
    const count = drinksByCountry.length
    let title = country
    if (drinksByCountry.length > 0) {
      const split = drinksByCountry[0].made_in.split(', ')
      if (split.length > 1) title = split[1]
    }

    // sort drinks by brand and name
    drinksByCountry.sort((a, b) => (a.brand !== b.brand) ? a.brand.localeCompare(b.brand) : a.name.localeCompare(b.name))
    if (limit > 0) drinksByCountry = drinksByCountry.slice(skip, skip + limit)

    res.status(200).sendResponse({
      country: title,
      count,
      page,
      limit,
      drinks: drinksByCountry.map(({ _id, __v, ...resto }) => resto)
    })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}
