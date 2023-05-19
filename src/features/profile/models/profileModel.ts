import { BaseResponse } from '~/shared/types'

export type GetPersonalProfileResponse = BaseResponse<{
  id: number
  userAccountId: number
  email: string
  displayName: string
  phoneNumber: string
  identityNumber: string
  currentCredit: number
  avatar: string
  address: string
  addressWardId: number
  addressWard: string
  addressDistrict: string
  addressProvince: string
}>

export type UpdateProfileRequest = {
  displayName: string
  phoneNumber: string
  avatar: string
  address: string
  addressWardId: number
}

export type UpdateProfileResponse = BaseResponse<boolean>

export type GetAnonymousProfileResponse = BaseResponse<{
  id: number
  userAccountId: number
  email: string
  displayName: string
  avatar: string
  address: string
  addressWardId: number
  addressWard: string
  addressDistrict: string
  addressProvince: string
}>
