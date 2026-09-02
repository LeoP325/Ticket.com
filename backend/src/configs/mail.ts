import nodemailer from 'nodemailer'

const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      pool: true,
      connectionTimeout: 10_000,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : nodemailer.createTransport({ jsonTransport: true })

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#/verify-email?token=${encodeURIComponent(token)}`
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'TIXLIGHT <no-reply@tixlight.local>',
    to: email,
    subject: 'TIXLIGHT Email 驗證',
    text: `請開啟以下連結完成 Email 驗證（24 小時內有效）：${link}`,
    html: `<p>請點擊下方連結完成 Email 驗證（24 小時內有效）：</p><p><a href="${link}">驗證 Email</a></p>`,
  })
  if (!hasSmtp) console.log(`[開發模式] Email 驗證連結：${link}`)
}

export async function sendRaffleWinnerEmail(
  email: string,
  account: string,
  eventTitle: string,
  eventSlug: string,
) {
  const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#/events/${eventSlug}`
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'TIXLIGHT <no-reply@tixlight.local>',
    to: email,
    subject: `恭喜中選｜${eventTitle}`,
    text: `${account} 您好，恭喜您中選「${eventTitle}」！請登入帳號查看活動資訊：${link}`,
    html: `<p>${account} 您好，恭喜您中選「${eventTitle}」！</p><p><a href="${link}">登入查看活動資訊</a></p>`,
  })
  if (!hasSmtp) console.log(`[開發模式] 抽選中選通知：${email}｜${eventTitle}`)
}

export async function verifyMailTransport() {
  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'FRONTEND_URL'].filter(
    (key) => !process.env[key],
  )
  if (process.env.REQUIRE_SMTP === 'true' && missing.length)
    throw new Error(`正式環境缺少 ${missing.join('、')}`)
  if (!hasSmtp) {
    console.log('SMTP 未設定，Email 使用開發模式')
    return
  }
  await transporter.verify()
  console.log('SMTP 連線成功')
}
