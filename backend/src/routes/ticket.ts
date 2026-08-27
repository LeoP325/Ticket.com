import { Router } from 'express'
import * as controllerTicket from '../controllers/ticket'
import * as middlewareAuth from '../middlewares/auth'

const router = Router()
router.use(middlewareAuth.jwt)
router.get('/:eventSlug', controllerTicket.getSeats)
router.post('/:eventSlug/hold', controllerTicket.holdSeat)
router.delete('/:eventSlug/hold', controllerTicket.releaseSeat)
router.post('/:eventSlug/confirm', controllerTicket.confirmSeat)

export default router
