import { BaseResponse, PagedResponse, BaseParams } from '~/shared/types'

export type GetUserAccountListParams = BaseParams

export type GetUserAccountListResponse = PagedResponse<{
  id: number
  userAccountId: number
  email: string
  displayName: string
  phoneNumber: string
  identityNumber: string
  avatar: string
  address: string
  addressWard: string
  addressDistrict: string
  addressProvince: string
}>

export type GetUserAccountDetailResponse = BaseResponse<{
  email: string
  isVerified: boolean
  isActived: boolean
  roleId: number
  roleName: string
}>

export type UpdateUserAccountRequest = {
  roleId: number
  isActived: boolean
}

export type UpdateUserAccountResponse = BaseResponse<boolean>
