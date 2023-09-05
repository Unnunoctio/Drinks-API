import multer from 'multer'
import { Router } from 'express'
import { addDrink, addManyDrinks, deleteDrink, getAllDrinks, getDrinkById, modifyDrink } from '../../controllers/v1/drinks.js'
import verifyApiKey from '../../middlewares/verifyApiKey.js'

const storage = multer.memoryStorage()
const upload = multer({ storage })
const router = Router()

router.get('/', (_, res) => {
  const data = {
    drinks: 'https://api-drinks.vercel.app/api/v1/drinks?{page, limit, name, brand, alcoholic_grade, content, package, category, sub_category} (all drinks: limit=0)',
    drinks_by_id: 'https://api-drinks.vercel.app/api/v1/drinks/{drink_id}'
  }

  res.sendResponse(data)
})

router.get('/drinks', getAllDrinks)

router.get('/drinks/:id', getDrinkById)

router.post('/drinks', verifyApiKey, addDrink)

router.post('/drinks/excel', [verifyApiKey, upload.single('file')], addManyDrinks)

router.patch('/drinks/:id', verifyApiKey, modifyDrink)

router.delete('/drinks/:id', verifyApiKey, deleteDrink)

export default router
