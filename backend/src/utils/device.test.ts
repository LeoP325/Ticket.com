import assert from 'node:assert/strict'
import { test } from 'node:test'
import { detectDevice } from './device'

test('detects common desktop and mobile devices', () => {
  assert.deepEqual(
    detectDevice(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
    ),
    { deviceType: 'desktop', browser: 'Edge 140.0.0.0', os: 'Windows 10/11' },
  )
  assert.deepEqual(
    detectDevice(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 Version/18.6 Mobile/15E148 Safari/604.1',
      '?1',
    ),
    { deviceType: 'mobile', browser: 'Safari 18.6', os: 'iOS 18.6' },
  )
})
