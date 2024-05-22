import { Router } from 'express'
import { getAllCategories, getCategory, getSubCategory } from '../../controllers/v1/category.js'

const router = Router()

router.get('/category', getAllCategories)

router.get('/category/:category', getCategory)

router.get('/category/:category/:subCategory', getSubCategory)

export default router
