export interface RegisterForm {
  account: string
  email: string
  nickname?: string
  password: string
}

export interface LoginForm {
  account: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  account: string
  email: string
  nickname: string
  role: 'user' | 'admin'
}

export interface ProfileUpdateForm {
  email: string
  nickname: string
  currentPassword: string
  newPassword: string
}

export interface ProfileResponse {
  email: string
  nickname: string
}
