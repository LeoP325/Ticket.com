import { Router } from 'express'
import * as controllerEvent from '../controllers/event'

const router = Router()
router.get('/', controllerEvent.getAll)
router.get('/:slug', controllerEvent.getOne)

export default router
