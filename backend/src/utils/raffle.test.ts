import assert from 'node:assert/strict'
import test from 'node:test'
import { allocateRaffle, arenaSeatLabel, shuffle } from './raffle'

test('15,000 席分區邊界與洗牌內容正確', () => {
  assert.equal(arenaSeatLabel(0), '紅1A 區 1 排 1 號')
  assert.equal(arenaSeatLabel(14999), '黃3E 區 30 排 25 號')
  assert.deepEqual(shuffle([1, 2, 3]).sort(), [1, 2, 3])
})

test('2,000 人登記 1,000 張票時只抽出 1,000 人', () => {
  const entries = Array.from({ length: 2000 }, () => ({ quantity: 1 }))
  const result = allocateRaffle(entries, 1000)
  assert.equal(result.winners.length, 1000)
  assert.equal(result.losers.length, 1000)
  assert.equal(result.allocatedTickets, 1000)
})

test('粉絲見面會超過 5 人報名時只選出 5 個帳號', () => {
  const entries = Array.from({ length: 8 }, (_, index) => ({ account: index, quantity: 1 }))
  const result = allocateRaffle(shuffle(entries), 5)
  assert.equal(result.winners.length, 5)
  assert.equal(result.losers.length, 3)
  assert.equal(new Set(result.winners.map(({ entry }) => entry.account)).size, 5)
})
