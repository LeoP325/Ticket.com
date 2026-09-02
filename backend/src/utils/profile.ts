import * as yup from 'yup'

const optionalText = () =>
  yup
    .string()
    .transform((value: string) => value.trim() || undefined)
    .optional()

export const profileSchema = yup
  .object({
    email: yup.string().trim().required('Email 必填').email('Email 格式錯誤'),
    nickname: optionalText().max(30, '暱稱最長 30 個字'),
    currentPassword: optionalText().max(20, '目前密碼最長 20 個字'),
    newPassword: optionalText().min(4, '新密碼最少 4 個字').max(20, '新密碼最長 20 個字'),
  })
  .test(
    'current-password',
    '修改密碼時必須輸入目前密碼',
    (value) => !value.newPassword || Boolean(value.currentPassword),
  )
