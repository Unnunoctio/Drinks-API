/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { getDrinks } from '../controllers/drink-controller'

const router = Router()

router.get('/drinks', getDrinks)

router.post('/drinks/excel')

export default router
