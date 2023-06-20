import {
  GetMemberRolesResponse,
  CreateMemberRoleRequest,
  CreateMemberRoleResponse,
  DeleteMemberRoleParams,
  DeleteMemberRoleResponse
} from '~/features/memberRole/models'
import { HttpHelper } from '~/shared/helpers'

const memberRoleApi = {
  getMemberRoles(projectMemberId: number) {
    return HttpHelper.get<GetMemberRolesResponse>(`member-role/${projectMemberId}`)
  },
  createMemberRole(body: CreateMemberRoleRequest) {
    return HttpHelper.post<CreateMemberRoleResponse>('member-role', body)
  },
  deleteMemberRole(params: DeleteMemberRoleParams) {
    return HttpHelper.delete<DeleteMemberRoleResponse>('member-role', { params })
  }
}

export default memberRoleApi
