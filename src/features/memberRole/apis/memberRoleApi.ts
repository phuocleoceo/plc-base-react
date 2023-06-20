import {
  GetMemberRolesResponse,
  CreateMemberRoleRequest,
  CreateMemberRoleResponse,
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
  deleteMemberRole(projectMemberId: number, projectRoleId: number) {
    return HttpHelper.delete<DeleteMemberRoleResponse>('member-role', {
      params: {
        projectMemberId,
        projectRoleId
      }
    })
  }
}

export default memberRoleApi
