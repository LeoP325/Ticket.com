<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">註冊</h1>
      </v-col>

      <v-col>
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
          <v-text-field
            v-model="account"
            :error-messages="errors.account"
            hint="長度 4 ~ 20 的英數字"
            label="帳號"
            prepend-icon="mdi-account"
          />

          <v-text-field
            v-model="password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :error-messages="errors.password"
            hint="長度 4 ~ 20 字"
            label="密碼"
            prepend-icon="mdi-lock"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-text-field
            v-model="confirmPassword"
            :append-inner-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
            :error-messages="errors.confirmPassword"
            hint="長度 4 ~ 20 字"
            label="確認密碼"
            prepend-icon="mdi-lock"
            :type="showPasswordConfirm ? 'text' : 'password'"
            @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
          />

          <v-btn block color="primary" :loading="isSubmitting" type="submit">註冊</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import validator from 'validator'
  import { useForm } from 'vee-validate'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import * as yup from 'yup'
  import { useRegisterMutation } from '@/quries/auth'
  import { useSnackbarStore } from '@/stores/snackbar'

  const { mutateAsync: register } = useRegisterMutation()
  const router = useRouter()
  const snackbar = useSnackbarStore()

  const showPassword = ref(false)
  const showPasswordConfirm = ref(false)

  const schema = yup.object({
    account: yup
      .string()
      .typeError('資料格式錯誤')
      .required('帳號必填')
      .min(4, '帳號必需是 4 個字以上')
      .max(20, '帳號必需是 20 個字以下')
      // 自訂驗證(驗證名稱, 錯誤訊息, 驗證方式)
      .test('isAlphanumeric', '帳號只能是英數字', value => validator.isAlphanumeric(value)),
    password: yup
      .string()
      .typeError('資料格式錯誤')
      .required('密碼必填')
      .min(4, '密碼最少 4 個字')
      .max(20, '密碼最長 20 個字'),
    confirmPassword: yup
      .string()
      .typeError('資料格式錯誤')
      // 限制值必須是陣列中的其中一個
      // .oneOf(陣列, 錯誤訊息)
      // 取得其他欄位的值當參考
      // yup.ref(欄位名稱)
      .oneOf([yup.ref('password')], '密碼不一致'),
  })

  // 建立表單
  // defineField = 定義表單的輸入欄位
  // handleSubmit = 表單送出後的處理
  // isSubmitting = 表單是否送出中
  // errors = 表單的欄位錯誤
  const { defineField, handleSubmit, isSubmitting, errors } = useForm({
    // 設定表單的驗證規則
    validationSchema: schema,
    // 設定表單的初始值
    initialValues: {
      account: '',
      password: '',
      confirmPassword: '',
    },
  })

  // 建立表單輸入欄位
  const [account] = defineField('account')
  const [password] = defineField('password')
  const [confirmPassword] = defineField('confirmPassword')

  // 表單送出
  // values = 表單各欄位的值
  const submit = handleSubmit(async values => {
    try {
      await register({
        account: values.account,
        password: values.password,
      })
      snackbar.add({ text: '註冊成功', color: 'green' })
      router.push('/login')
    } catch (error) {
      snackbar.addError(error)
    }
  })
</script>

<route lang="yaml">
meta:
  title: 註冊
  login: no-login-only
</route>
