import {
  GetUserAccountListParams,
  GetUserAccountListResponse,
  GetUserAccountDetailResponse,
  UpdateUserAccountRequest,
  UpdateUserAccountResponse
} from '~/features/admin/user/models'
import { HttpHelper } from '~/shared/helpers'

export function getUserAccountListProject(params: GetUserAccountListParams) {
  return HttpHelper.get<GetUserAccountListResponse>('user', { params })
}

export function getUserAccountDetailProject(userId: number) {
  return HttpHelper.get<GetUserAccountDetailResponse>(`user/account/${userId}`)
}

export function updateUserAccountProject(userId: number, body: UpdateUserAccountRequest) {
  return HttpHelper.put<UpdateUserAccountResponse>(`user/account/${userId}`, body)
}
