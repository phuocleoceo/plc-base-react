import { BaseResponse, PagedResponse, BaseParams } from '~/shared/types'
import { UserAccount, UserAccountDetail } from './userAccountType'

export type GetUserAccountsParams = BaseParams

export type GetUserAccountsResponse = PagedResponse<UserAccount>

export type GetUserAccountDetailResponse = BaseResponse<UserAccountDetail>

export type UpdateUserAccountRequest = {
  roleId: number
  isActived: boolean
}

export type UpdateUserAccountResponse = BaseResponse<boolean>
