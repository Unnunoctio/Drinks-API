import { Router } from 'express'
import { getAllDrinks } from '../../controllers/v1/drinks.js'

const router = Router()

router.get('/', (_, res) => {
  const data = {
    drinks: 'https://api-drinks.vercel.app/api/v1/drinks?{page, limit, name, brand, alcoholic_grade, content, package, category, sub_category} (all drinks: limit=0)'
  }

  res.sendResponse(data)
})

router.get('/drinks', getAllDrinks)

export default router
