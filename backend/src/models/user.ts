import { Schema, model, Error as MongooseError, type HydratedDocument, Types } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

export interface ICart {
  product: Types.ObjectId
  quantity: number
}

export interface IUser {
  _id: Types.ObjectId
  account: string
  password: string
  cart: ICart[]
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

// Document = 純資料
// HydratedDocument = 純資料 + mongoose 特有的功能，例如.save()
export type UserDocument = HydratedDocument<IUser>

const cartSchema = new Schema<ICart>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: [true, '商品必填'],
  },
  quantity: {
    type: Number,
    required: [true, '數量必填'],
    min: [1, '數量最少是 1'],
  },
})

const schema = new Schema<IUser>(
  {
    account: {
      type: String,
      required: [true, '帳號必填'],
      minLength: [4, '帳號必需是 4 個字以上'],
      maxLength: [20, '帳號必需是 20 個字以下'],
      validate: {
        validator: (value) => {
          return validator.isAlphanumeric(value)
        },
        message: '帳號只能是英數字',
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, '密碼必填'],
      select: false,
    },
    cart: {
      type: [cartSchema],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
)

// mongoose 格式驗證後，放入資料庫前
// 不能用箭頭函式，因為 this 代表要保存的資料
schema.pre('save', async function () {
  // 如果密碼欄位沒有修改，不做事
  if (!this.isModified('password')) return

  // 驗證密碼格式
  let message = ''
  if (this.password.length < 4) {
    message = '密碼最少 4 個字'
  } else if (this.password.length > 20) {
    message = '密碼最長 20 個字'
  }
  // 如果密碼格式錯誤，拋出驗證錯誤
  // 用跟 mongoose 一樣的驗證錯誤格式，方便一起處理
  if (message !== '') {
    const error = new MongooseError.ValidationError()
    error.addError('password', new MongooseError.ValidatorError({ message }))
    throw error
  }

  // 驗證成功，加密
  this.password = await bcrypt.hash(this.password, 10)
})

export default model('users', schema)
