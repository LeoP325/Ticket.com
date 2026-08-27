import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import routeAuth from './routes/auth'
import routeEvent from './routes/event'
import routeOrder from './routes/order'
import routeTicket from './routes/ticket'
import middlewareError from './middlewares/error'
import './configs/passport'
import { ensureCatalog } from './data/catalog'

mongoose.set('sanitizeFilter', true)

const app = express()

app.use(helmet())

app.use(
  cors({
    // origin 請求來源網域
    // callback(錯誤, 是否允許)
    origin: (origin, callback) => {
      if (
        origin &&
        ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://leop325.github.io'].includes(
          origin,
        )
      ) {
        callback(null, true)
      } else {
        callback(new Error('CORS'), false)
      }
    },
    // 允許跨網域請求攜帶 cookie
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.use('/auth', routeAuth)
app.use('/events', routeEvent)
app.use('/orders', routeOrder)
app.use('/ticket', routeTicket)

app.use(middlewareError)

async function start() {
  await mongoose.connect(process.env.DB_URL)
  await ensureCatalog()
  console.log('資料庫連線成功')

  app.listen(process.env.PORT || 4000, () => {
    console.log('伺服器啟動')
  })
}

start().catch((error) => {
  console.error(error)
  console.error('伺服器啟動失敗')
})
