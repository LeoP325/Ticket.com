import assert from 'node:assert/strict'
import { test } from 'node:test'
import { profileSchema } from './profile'

test('changing password requires the current password', async () => {
  await assert.rejects(
    profileSchema.validate({ email: 'user@example.com', newPassword: 'newpass' }),
    /目前密碼/,
  )
  await assert.doesNotReject(
    profileSchema.validate({
      email: 'user@example.com',
      currentPassword: 'oldpass',
      newPassword: 'newpass',
    }),
  )
})
