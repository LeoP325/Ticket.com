// .d.ts 是型別定義檔，不用 import 就可以用
// 用 declare 全域宣告型別，整個專案不用 import 也能知道
// namespace 命名空間，避免變數名稱重複
declare namespace NodeJS {
  interface ProcessEnv {
    // DB_URL: string | undefined
    DB_URL: string
    PORT: string
    JWT_SECRET: string
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    FRONTEND_URL?: string
    SMTP_HOST?: string
    SMTP_PORT?: string
    SMTP_SECURE?: string
    SMTP_USER?: string
    SMTP_PASS?: string
    MAIL_FROM?: string
    NODE_ENV?: 'development' | 'production' | 'test'
  }
}

// 命名空間範例
// namespace UserCart {
//   const calculate = () => {
//     console.log('計算購物車金額')
//   }
// }
// UserCart.calculate()

// namespace Order {
//   const calculate = () => {
//     console.log('計算使用者全部訂單總金額')
//   }
// }
// Order.calculate()
