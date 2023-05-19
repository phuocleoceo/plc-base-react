import {
  GetMemberForProjectParams,
  GetMemberForProjectResponse,
  DeleteProjectMemberResponse
} from '~/features/projectMember/models'
import { HttpHelper } from '~/shared/helpers'

const projectMemberApi = {
  getMemberForProject(projectId: number, params: GetMemberForProjectParams) {
    return HttpHelper.get<GetMemberForProjectResponse>(`project/${projectId}/member`, { params })
  },
  deleteProjectMember(projectId: number, projectMemberId: number) {
    return HttpHelper.delete<DeleteProjectMemberResponse>(`project/${projectId}/member/${projectMemberId}`)
  }
}

export default projectMemberApi
