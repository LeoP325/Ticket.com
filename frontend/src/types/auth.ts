export interface RegisterForm {
  account: string
  password: string
}

export interface LoginForm {
  account: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  account: string
  role: 'user' | 'admin'
}
