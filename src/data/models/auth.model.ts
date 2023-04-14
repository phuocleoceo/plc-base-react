import { BaseResponse } from '~/shared/types'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = BaseResponse<{
  id: number
  email: string
  roleId: number
  accessToken: string
  accessTokenExpiredAt: Date
  refreshToken: string
  refreshTokenExpiredAt: Date
}>

export type RegisterRequest = {
  email: string
  password: string
  displayName: string
  phoneNumber: string
  identityNumber: string
  avatar: string
  address: string
  addressWardId: number
  roleId: number
}

export type RegisterResponse = BaseResponse<{
  id: number
  email: string
}>

export type ConfirmEmailRequest = {
  userId: number
  code: string
}

export type ConfirmEmailResponse = BaseResponse<boolean>

export type ChangePasswordRequest = {
  oldPassword: string
  newPassword: string
}

export type ChangePasswordResponse = BaseResponse<boolean>

export type ForgotPasswordRequest = {
  identityInformation: string
}

export type ForgotPasswordResponse = BaseResponse<boolean>

export type RecoverPasswordRequest = {
  userId: number
  code: string
  newPassword: string
}

export type RecoverPasswordResponse = BaseResponse<boolean>

export type RefreshTokenRequest = {
  accessToken: string
  refreshToken: string
}

export type RefreshTokenResponse = BaseResponse<{
  accessToken: string
  accessTokenExpiredAt: Date
  refreshToken: string
  refreshTokenExpiredAt: Date
}>

export type RevokeRefreshTokenResponse = BaseResponse<boolean>
