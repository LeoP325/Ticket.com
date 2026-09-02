<script setup lang="ts">
  import { useForm } from 'vee-validate'
  import { shallowRef } from 'vue'
  import * as yup from 'yup'
  import { useUpdateProfileMutation } from '@/quries/auth'
  import { useSnackbarStore } from '@/stores/snackbar'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const snackbar = useSnackbarStore()
  const { mutateAsync: updateProfile } = useUpdateProfileMutation()
  const showCurrentPassword = shallowRef(false)
  const showNewPassword = shallowRef(false)
  const showConfirmPassword = shallowRef(false)

  function optionalPassword () {
    return yup
      .string()
      .transform(value => value || undefined)
      .optional()
  }

  const schema = yup
    .object({
      email: yup.string().trim().required('Email 必填').email('Email 格式錯誤'),
      nickname: yup.string().trim().max(30, '暱稱最長 30 個字'),
      currentPassword: optionalPassword(),
      newPassword: optionalPassword().min(4, '新密碼最少 4 個字').max(20, '新密碼最長 20 個字'),
      confirmPassword: optionalPassword().oneOf([yup.ref('newPassword')], '新密碼不一致'),
    })
    .test('current-password', (value, context) => {
      if (!value.newPassword || value.currentPassword) return true
      return context.createError({
        path: 'currentPassword',
        message: '修改密碼時請輸入目前密碼',
      })
    })

  const { defineField, errors, handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: schema,
    initialValues: {
      email: user.email,
      nickname: user.nickname,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const [email] = defineField('email')
  const [nickname] = defineField('nickname')
  const [currentPassword] = defineField('currentPassword')
  const [newPassword] = defineField('newPassword')
  const [confirmPassword] = defineField('confirmPassword')

  const submit = handleSubmit(async values => {
    try {
      await updateProfile({
        email: values.email,
        nickname: values.nickname,
        currentPassword: values.currentPassword ?? '',
        newPassword: values.newPassword ?? '',
      })
      resetForm({
        values: {
          email: user.email,
          nickname: user.nickname,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
      })
      snackbar.add({ text: '個人資料更新成功', color: 'green' })
    } catch (error) {
      snackbar.addError(error)
    }
  })
</script>

<template>
  <v-form :disabled="isSubmitting" @submit.prevent="submit">
    <v-text-field
      v-model="email"
      :error-messages="errors.email"
      label="Email"
      prepend-icon="mdi-email-outline"
      type="email"
    />

    <v-text-field
      v-model="nickname"
      :error-messages="errors.nickname"
      hint="最多 30 個字，可留空"
      label="暱稱（選填）"
      prepend-icon="mdi-card-account-details-outline"
    />

    <v-divider class="mb-6 mt-2" />
    <h2 class="password-title">修改密碼（選填）</h2>
    <p class="password-hint">不修改密碼時，以下欄位保持空白即可。</p>

    <v-text-field
      v-model="currentPassword"
      :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
      autocomplete="current-password"
      :error-messages="errors.currentPassword"
      label="目前密碼"
      prepend-icon="mdi-lock-outline"
      :type="showCurrentPassword ? 'text' : 'password'"
      @click:append-inner="showCurrentPassword = !showCurrentPassword"
    />

    <v-text-field
      v-model="newPassword"
      :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
      autocomplete="new-password"
      :error-messages="errors.newPassword"
      hint="長度 4 ~ 20 字"
      label="新密碼"
      prepend-icon="mdi-lock-reset"
      :type="showNewPassword ? 'text' : 'password'"
      @click:append-inner="showNewPassword = !showNewPassword"
    />

    <v-text-field
      v-model="confirmPassword"
      :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
      autocomplete="new-password"
      :error-messages="errors.confirmPassword"
      label="確認新密碼"
      prepend-icon="mdi-lock-check-outline"
      :type="showConfirmPassword ? 'text' : 'password'"
      @click:append-inner="showConfirmPassword = !showConfirmPassword"
    />

    <v-btn block color="primary" :loading="isSubmitting" type="submit">儲存變更</v-btn>
  </v-form>
</template>

<style scoped>
.password-title {
  color: #172033;
  font-size: 1.1rem;
}

.password-hint {
  color: #667085;
  font-size: 0.9rem;
  margin: 6px 0 20px 40px;
}
</style>
