import { Router } from 'express'
import * as controllerTicket from '../controllers/ticket'
import * as middlewareAuth from '../middlewares/auth'
import * as controllerRaffle from '../controllers/raffle'

const router = Router()
router.use(middlewareAuth.jwt)
router.get('/:eventSlug/raffle', controllerRaffle.getEntry)
router.post('/:eventSlug/raffle', controllerRaffle.register)
router.post('/:eventSlug/raffle/draw', middlewareAuth.admin, controllerRaffle.draw)
router.get('/:eventSlug', controllerTicket.getSeats)
router.post('/:eventSlug/hold', controllerTicket.holdSeat)
router.delete('/:eventSlug/hold', controllerTicket.releaseSeat)
router.post('/:eventSlug/confirm', controllerTicket.confirmSeat)

export default router
