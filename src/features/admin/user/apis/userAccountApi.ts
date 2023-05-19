import {
  GetUserAccountListParams,
  GetUserAccountListResponse,
  GetUserAccountDetailResponse,
  UpdateUserAccountRequest,
  UpdateUserAccountResponse
} from '~/features/admin/user/models'
import { HttpHelper } from '~/shared/helpers'

const userAccountApi = {
  getUserAccountListProject(params: GetUserAccountListParams) {
    return HttpHelper.get<GetUserAccountListResponse>('user', { params })
  },
  getUserAccountDetailProject(userId: number) {
    return HttpHelper.get<GetUserAccountDetailResponse>(`user/account/${userId}`)
  },
  updateUserAccountProject(userId: number, body: UpdateUserAccountRequest) {
    return HttpHelper.put<UpdateUserAccountResponse>(`user/account/${userId}`, body)
  }
}

export default userAccountApi
