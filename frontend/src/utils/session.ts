const storageKey = 'tixlight-session-id'
let sessionId = sessionStorage.getItem(storageKey) || crypto.randomUUID()
sessionStorage.setItem(storageKey, sessionId)

interface SessionMessage {
  type: 'probe' | 'occupied'
  sessionId: string
  requestId: string
}

const requestId = crypto.randomUUID()
const channel = typeof BroadcastChannel === 'undefined'
  ? undefined
  : new BroadcastChannel('tixlight-sessions')

const sessionReady = new Promise<void>(resolve => {
  if (!channel) {
    resolve()
    return
  }

  const timer = window.setTimeout(resolve, 80)
  channel.addEventListener('message', ({ data }: MessageEvent<SessionMessage>) => {
    if (data.type === 'probe' && data.sessionId === sessionId) {
      channel.postMessage({ type: 'occupied', sessionId, requestId: data.requestId })
    } else if (data.type === 'occupied' && data.requestId === requestId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem(storageKey, sessionId)
      window.clearTimeout(timer)
      resolve()
    }
  })
  channel.postMessage({ type: 'probe', sessionId, requestId })
})

export async function getSessionId () {
  await sessionReady
  return sessionId
}
