import {
  GetMemberForProjectParams,
  GetMemberForProjectResponse,
  GetMemberForSelectResponse,
  DeleteProjectMemberResponse,
  LeaveProjectResponse
} from '~/features/projectMember/models'
import { HttpHelper } from '~/shared/helpers'

const projectMemberApi = {
  getMemberForProject(projectId: number, params: GetMemberForProjectParams) {
    return HttpHelper.get<GetMemberForProjectResponse>(`project/${projectId}/member`, { params })
  },
  getMemberForSelect(projectId: number) {
    return HttpHelper.get<GetMemberForSelectResponse>(`project/${projectId}/member/select`)
  },
  deleteProjectMember(projectId: number, projectMemberId: number) {
    return HttpHelper.delete<DeleteProjectMemberResponse>(`project/${projectId}/member/${projectMemberId}`)
  },
  leaveProject(projectId: number) {
    return HttpHelper.put<LeaveProjectResponse>(`project/${projectId}/member/leave`)
  }
}

export default projectMemberApi
