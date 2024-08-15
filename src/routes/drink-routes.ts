/* eslint-disable @typescript-eslint/no-misused-promises */
import multer from 'multer'
import { Router } from 'express'
import { addManyDrinks, getDrinks, getManyDrinks } from '../controllers/drink-controller'

const storage = multer.memoryStorage()
const upload = multer({ storage })
const router = Router()

router.get('/drinks', getDrinks)

router.get('/drinks/excel', getManyDrinks)

router.post('/drinks/excel', upload.single('file'), addManyDrinks)

export default router
