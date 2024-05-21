import { Router } from 'express'
import { getAllBrands, getBrandByName } from '../../controllers/v1/brand.js'

const router = Router()

router.get('/brand', getAllBrands)

router.get('/brand/:brand', getBrandByName)

export default router
