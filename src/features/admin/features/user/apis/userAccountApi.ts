import {
  GetUserAccountsParams,
  GetUserAccountsResponse,
  GetUserAccountDetailResponse,
  UpdateUserAccountRequest,
  UpdateUserAccountResponse
} from '~/features/admin/features/user/models'
import { HttpHelper } from '~/shared/helpers'

const userAccountApi = {
  getUserAccountListProject(params: GetUserAccountsParams) {
    return HttpHelper.get<GetUserAccountsResponse>('user', { params })
  },
  getUserAccountDetailProject(userId: number) {
    return HttpHelper.get<GetUserAccountDetailResponse>(`user/account/${userId}`)
  },
  updateUserAccountProject(userId: number, body: UpdateUserAccountRequest) {
    return HttpHelper.put<UpdateUserAccountResponse>(`user/account/${userId}`, body)
  }
}

export default userAccountApi
