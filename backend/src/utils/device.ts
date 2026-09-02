export interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
}

function version(value: string) {
  return value.replaceAll('_', '.')
}

export function detectDevice(userAgent: string, mobileHint?: string): DeviceInfo {
  const tablet = /iPad|Tablet|PlayBook|Silk/i.test(userAgent)
  const mobile = mobileHint === '?1' || /Mobi|iPhone|Android.+Mobile/i.test(userAgent)
  const deviceType = tablet ? 'tablet' : mobile ? 'mobile' : 'desktop'

  const browserMatch =
    userAgent.match(/Edg\/([\d.]+)/) ??
    userAgent.match(/OPR\/([\d.]+)/) ??
    userAgent.match(/Chrome\/([\d.]+)/) ??
    userAgent.match(/Firefox\/([\d.]+)/) ??
    userAgent.match(/Version\/([\d.]+).*Safari/)
  const browserName = /Edg\//.test(userAgent)
    ? 'Edge'
    : /OPR\//.test(userAgent)
      ? 'Opera'
      : /Chrome\//.test(userAgent)
        ? 'Chrome'
        : /Firefox\//.test(userAgent)
          ? 'Firefox'
          : /Safari\//.test(userAgent)
            ? 'Safari'
            : 'Unknown'
  const browser = browserMatch?.[1] ? `${browserName} ${browserMatch[1]}` : browserName

  const windows = userAgent.match(/Windows NT ([\d.]+)/)
  const android = userAgent.match(/Android ([\d.]+)/)
  const ios = userAgent.match(/(?:CPU (?:iPhone )?OS|iPhone OS) ([\d_]+)/)
  const mac = userAgent.match(/Mac OS X ([\d_]+)/)
  const os = windows?.[1]
    ? `Windows ${windows[1] === '10.0' ? '10/11' : windows[1]}`
    : android?.[1]
      ? `Android ${android[1]}`
      : ios?.[1]
        ? `iOS ${version(ios[1])}`
        : mac?.[1]
          ? `macOS ${version(mac[1])}`
          : /Linux/i.test(userAgent)
            ? 'Linux'
            : 'Unknown'

  return { deviceType, browser, os }
}
