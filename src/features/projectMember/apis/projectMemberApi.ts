import {
  GetMemberForProjectParams,
  GetMemberForProjectResponse,
  GetMemberForSelectResponse,
  DeleteProjectMemberResponse
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
  }
}

export default projectMemberApi
