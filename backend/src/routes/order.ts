import { Router } from 'express'
import * as controllerOrder from '../controllers/order'
import * as middlewareAuth from '../middlewares/auth'

const router = Router()
router.get('/', middlewareAuth.jwt, controllerOrder.get)
router.get('/all', middlewareAuth.jwt, middlewareAuth.admin, controllerOrder.getAll)
router.post('/:id/refund', middlewareAuth.jwt, controllerOrder.refund)

export default router
