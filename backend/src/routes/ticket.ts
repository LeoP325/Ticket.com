import { Router } from 'express'
import * as middlewareAuth from '../middlewares/auth'
import * as controllerTicket from '../controllers/ticket'

const router = Router()

router.use(middlewareAuth.jwt)
router.get('/', controllerTicket.getSeats)
router.post('/hold', controllerTicket.holdSeat)
router.delete('/hold', controllerTicket.releaseSeat)
router.post('/confirm', controllerTicket.confirmSeat)

export default router
