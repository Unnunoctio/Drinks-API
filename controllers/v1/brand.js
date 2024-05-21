import DrinkModel from '../../models/DrinkModel.js'
import { validatePagination } from '../../zod/PaginationSchema.js'

const generatePath = (value) => {
  return value.toLowerCase().replaceAll(/[.°+]/g, '').replaceAll(' ', '-').replaceAll('/', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const getAllBrands = async (req, res) => {
  try {
    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await DrinkModel.find()
    // agrupar los drinks mediante su brand
    const brands = drinks.reduce((acc, drink) => {
      const brand = drink.brand
      if (!acc[brand]) acc[brand] = []
      acc[brand].push(drink)
      return acc
    }, {})

    // transformar el objeto en un array y ordenarlo
    let brandsArray = Object.keys(brands).map(brand => ({ brand, drinks: brands[brand] })).sort((a, b) => a.brand.localeCompare(b.brand))
    const count = brandsArray.length
    // separar el array en paginas y formatear el array
    if (limit > 0) { brandsArray = brandsArray.slice(skip, skip + limit) }
    const brandsFormat = brandsArray.map(brand => ({ brand: brand.brand, count: brand.drinks.length, path: `/${generatePath(brand.brand)}` }))

    res.status(200).sendResponse({
      count,
      page,
      limit,
      brands: brandsFormat
    })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const getBrandByName = async (req, res) => {
  try {
    const { brand } = req.params

    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await DrinkModel.find().lean()
    let drinksByBrand = drinks.filter(drink => generatePath(drink.brand) === brand)
    const count = drinksByBrand.length
    let title = brand
    if (drinksByBrand.length > 0) title = drinksByBrand[0].brand

    if (limit > 0) drinksByBrand = drinksByBrand.slice(skip, skip + limit)

    res.status(200).sendResponse({
      brand: title,
      count,
      page,
      limit,
      drinks: drinksByBrand.map(({ _id, __v, ...resto }) => resto)
    })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}
