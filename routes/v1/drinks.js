import multer from 'multer'
import { Router } from 'express'
import { addDrink, addManyDrinks, deleteAllDrinks, deleteDrink, getAllDrinks, modifyDrink } from '../../controllers/v1/drinks.js'
import verifyApiKey from '../../middlewares/verifyApiKey.js'

const storage = multer.memoryStorage()
const upload = multer({ storage })
const router = Router()

router.get('/drinks', getAllDrinks)

router.post('/drinks', verifyApiKey, addDrink)

router.post('/drinks/excel', [verifyApiKey, upload.single('file')], addManyDrinks)

router.patch('/drinks/:id', verifyApiKey, modifyDrink)

router.delete('/drinks/all', verifyApiKey, deleteAllDrinks)

router.delete('/drinks/:id', verifyApiKey, deleteDrink)

export default router
