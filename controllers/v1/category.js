import DrinkModel from '../../models/DrinkModel.js'
import { validatePagination } from '../../zod/PaginationSchema.js'

const generatePath = (value) => {
  return value.toLowerCase().replaceAll(/[.°+]/g, '').replaceAll(' ', '-').replaceAll('/', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const getAllCategories = async (req, res) => {
  try {
    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await DrinkModel.find()
    // agrupar los drinks mediante su category
    const categories = drinks.reduce((acc, drink) => {
      const category = drink.category
      if (!acc[category]) acc[category] = []
      acc[category].push(drink)
      return acc
    }, {})

    // transformar el objeto en un array y ordenarlo
    let categoriesArray = Object.keys(categories).map(category => ({ category, drinks: categories[category] })).sort((a, b) => a.category.localeCompare(b.category))
    const count = categoriesArray.length
    // separar el array en paginas y formatear el array
    if (limit > 0) { categoriesArray = categoriesArray.slice(skip, skip + limit) }
    const categoriesFormat = categoriesArray.map(category => ({ category: category.category, count: category.drinks.length, path: `/${generatePath(category.category)}` }))

    res.status(200).sendResponse({
      count,
      page,
      limit,
      categories: categoriesFormat
    })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const getCategory = async (req, res) => {
  try {
    const { category } = req.params

    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await DrinkModel.find().lean()
    let drinksByCategory = drinks.filter(drink => generatePath(drink.category) === category)

    // sub-categories
    const subCategories = drinksByCategory.reduce((acc, drink) => {
      const subCategory = drink.sub_category.replace(`${drinksByCategory[0].category} `, '')
      if (!acc[subCategory]) acc[subCategory] = []
      acc[subCategory].push(drink)
      return acc
    }, {})

    const subCategoriesArray = Object.keys(subCategories).map(subCategory => ({ 'sub-category': subCategory, drinks: subCategories[subCategory] })).sort((a, b) => a['sub-category'].localeCompare(b['sub-category']))
    const subCategoriesFormat = subCategoriesArray.map(subCategory => ({ 'sub-category': subCategory['sub-category'], count: subCategory.drinks.length, path: `/${generatePath(subCategory['sub-category'])}` }))

    const count = drinksByCategory.length
    let title = category
    if (drinksByCategory.length > 0) title = drinksByCategory[0].category

    // sort drinks by brand and name
    drinksByCategory.sort((a, b) => (a.brand !== b.brand) ? a.brand.localeCompare(b.brand) : a.name.localeCompare(b.name))
    if (limit > 0) drinksByCategory = drinksByCategory.slice(skip, skip + limit)

    res.status(200).sendResponse({
      category: title,
      'sub-categories': subCategoriesFormat,
      count,
      page,
      limit,
      drinks: drinksByCategory.map(({ _id, __v, ...resto }) => resto)
    })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}

export const getSubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.params

    const pagination = validatePagination(req.parsedQuery)
    if (pagination.error) throw new Error(pagination.error.message)

    const { page, limit } = pagination.data
    const skip = (page - 1) * limit

    const drinks = await DrinkModel.find().lean()
    let drinksBySubCategory = drinks.filter(drink => generatePath(drink.category) === category && generatePath(drink.sub_category).replace(`${category}-`, '') === subCategory)
    const count = drinksBySubCategory.length
    let categoryTitle = category
    let subCategoryTitle = subCategory
    if (drinksBySubCategory.length > 0) {
      categoryTitle = drinksBySubCategory[0].category
      subCategoryTitle = (drinksBySubCategory[0].sub_category).replace(`${categoryTitle} `, '')
    }

    // sort drinks by brand and name
    drinksBySubCategory.sort((a, b) => (a.brand !== b.brand) ? a.brand.localeCompare(b.brand) : a.name.localeCompare(b.name))
    if (limit > 0) drinksBySubCategory = drinksBySubCategory.slice(skip, skip + limit)

    res.status(200).sendResponse({
      category: categoryTitle,
      'sub-category': subCategoryTitle,
      count,
      page,
      limit,
      drinks: drinksBySubCategory.map(({ _id, __v, ...resto }) => resto)
    })
  } catch (error) {
    res.status(400).sendResponse({
      error: JSON.parse(error.message)
    })
  }
}
