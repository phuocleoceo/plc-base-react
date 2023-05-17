import {
  GetUserAccountListResponse,
  GetUserAccountDetailResponse,
  UpdateUserAccountRequest,
  UpdateUserAccountResponse
} from '~/features/admin/user/models'
import { HttpHelper } from '~/shared/helpers'

export function getUserAccountListProject() {
  return HttpHelper.get<GetUserAccountListResponse>('user')
}

export function getUserAccountDetailProject(userId: number) {
  return HttpHelper.get<GetUserAccountDetailResponse>(`user/account/${userId}`)
}

export function updateUserAccountProject(userId: number, body: UpdateUserAccountRequest) {
  return HttpHelper.put<UpdateUserAccountResponse>(`user/account/${userId}`, body)
}
