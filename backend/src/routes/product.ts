import { Router } from 'express'
import * as controllerProduct from '../controllers/product'
import * as middlewareAuth from '../middlewares/auth'
import middlewareUpload from '../middlewares/upload'

const router = Router()

router.post(
  '/',
  middlewareAuth.jwt,
  middlewareAuth.admin,
  middlewareUpload,
  controllerProduct.create,
)

router.patch(
  '/:id',
  middlewareAuth.jwt,
  middlewareAuth.admin,
  middlewareUpload,
  controllerProduct.update,
)

router.get('/', controllerProduct.get)
router.get('/all', middlewareAuth.jwt, middlewareAuth.admin, controllerProduct.getAll)
router.get('/:id', controllerProduct.getId)

export default router
