import assert from 'node:assert/strict'
import test from 'node:test'
import { randomUUID } from 'node:crypto'
import { parseSessionId } from './session'

test('分頁 session ID 僅接受有效 UUID', () => {
  const sessionId = randomUUID()
  assert.equal(parseSessionId(sessionId), sessionId)
  assert.throws(() => parseSessionId('same-for-every-tab'), /RT/)
})
