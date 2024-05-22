import { Router } from 'express'
import { getAllCountries, getCountry } from '../../controllers/v1/made-in.js'

const router = Router()

router.get('/made-in', getAllCountries)

router.get('/made-in/:country', getCountry)

export default router
