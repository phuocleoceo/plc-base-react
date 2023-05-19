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

const authApi = {
  login(body: LoginRequest) {
    return HttpHelper.post<LoginResponse>('auth/login', body)
  },
  register(body: RegisterRequest) {
    return HttpHelper.post<RegisterResponse>('auth/register', body)
  },
  confirmEmail(body: ConfirmEmailRequest) {
    return HttpHelper.put<ConfirmEmailResponse>('auth/confirm-email', body)
  },
  changePassword(body: ChangePasswordRequest) {
    return HttpHelper.put<ChangePasswordResponse>('auth/change-password', body)
  },
  forgotPassword(body: ForgotPasswordRequest) {
    return HttpHelper.post<ForgotPasswordResponse>('auth/forgot-password', body)
  },
  recoverPassword(body: RecoverPasswordRequest) {
    return HttpHelper.put<RecoverPasswordResponse>('auth/recover-password', body)
  },
  refreshToken(body: RefreshTokenRequest) {
    return HttpHelper.post<RefreshTokenResponse>('auth/refresh-token', body)
  },
  revokeRefreshToken() {
    return HttpHelper.post<RevokeRefreshTokenResponse>('auth/revoke-refresh-token', {})
  }
}

export default authApi
