import {
  GetUserAccountsParams,
  GetUserAccountsResponse,
  GetUserAccountDetailResponse,
  UpdateUserAccountRequest,
  UpdateUserAccountResponse
} from '~/features/admin/features/user/models'
import { HttpHelper } from '~/shared/helpers'

const userAccountApi = {
  getUserAccounts(params: GetUserAccountsParams) {
    return HttpHelper.get<GetUserAccountsResponse>('user', { params })
  },
  getUserAccountDetail(userId: number) {
    return HttpHelper.get<GetUserAccountDetailResponse>(`user/account/${userId}`)
  },
  updateUserAccount(userId: number, body: UpdateUserAccountRequest) {
    return HttpHelper.put<UpdateUserAccountResponse>(`user/account/${userId}`, body)
  }
}

export default userAccountApi
