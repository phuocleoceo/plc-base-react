import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ConfirmEmailRequest,
  ConfirmEmailResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  RevokeRefreshTokenResponse
} from '~/features/auth/models'
import { HttpHelper } from '~/shared/helpers'

export function login(body: LoginRequest) {
  return HttpHelper.post<LoginResponse>('auth/login', body)
}

export function register(body: RegisterRequest) {
  return HttpHelper.post<RegisterResponse>('auth/register', body)
}

export function confirmEmail(body: ConfirmEmailRequest) {
  return HttpHelper.put<ConfirmEmailResponse>('auth/confirm-email', body)
}
export function changePassword(body: ChangePasswordRequest) {
  return HttpHelper.put<ChangePasswordResponse>('auth/change-password', body)
}

export function forgotPassword(body: ForgotPasswordRequest) {
  return HttpHelper.post<ForgotPasswordResponse>('auth/forgot-password', body)
}

export function recoverPassword(body: RecoverPasswordRequest) {
  return HttpHelper.put<RecoverPasswordResponse>('auth/recover-password', body)
}

export function refreshToken(body: RefreshTokenRequest) {
  return HttpHelper.post<RefreshTokenResponse>('auth/refresh-token', body)
}

export function revokeRefreshToken() {
  return HttpHelper.post<RevokeRefreshTokenResponse>('auth/revoke-refresh-token', {})
}
