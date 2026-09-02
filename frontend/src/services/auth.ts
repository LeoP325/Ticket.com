import type { ApiResponse } from '@/types/api'
import type {
  LoginForm,
  LoginResponse,
  ProfileResponse,
  ProfileUpdateForm,
  RegisterForm,
} from '@/types/auth'
import type { AxiosResponse } from 'axios'
import { api, apiAuth } from '@/utils/api'

export function register (
  data: RegisterForm,
): Promise<AxiosResponse<ApiResponse<{}>>> {
  return api.post('/auth/register', data)
}

export function verifyEmail (
  token: string,
): Promise<AxiosResponse<ApiResponse<{}>>> {
  return api.post('/auth/verify-email', { token })
}

export function login (
  data: LoginForm,
): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
  return apiAuth.post('/auth/login', data)
}

export function refresh (): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
  return apiAuth.post('/auth/refresh')
}

export function logout (): Promise<AxiosResponse<ApiResponse<{}>>> {
  return apiAuth.delete('/auth/logout')
}

export function updateProfile (
  data: ProfileUpdateForm,
): Promise<AxiosResponse<ApiResponse<ProfileResponse>>> {
  return apiAuth.patch('/users/profile', data)
}
