import {
  GetIssuesInBacklogResponse,
  GetIssuesInSprintResponse,
  CreateIssueRequest,
  CreateIssueResponse,
  UpdateIssueRequest,
  UpdateIssueResponse,
  DeleteIssueResponse
} from '~/features/issue/models'
import { HttpHelper } from '~/shared/helpers'

const issueApi = {
  getIssuesInBacklog(projectId: number) {
    return HttpHelper.get<GetIssuesInBacklogResponse>(`project/${projectId}/backlog/issue`)
  },
  getIssuesInSprint(projectId: number, sprintId: number) {
    return HttpHelper.get<GetIssuesInSprintResponse>(`project/${projectId}/sprint/${sprintId}/issue`)
  },
  createIssueRequest(projectId: number, body: CreateIssueRequest) {
    return HttpHelper.post<CreateIssueResponse>(`project/${projectId}/issue`, body)
  },
  updateIssueRequest(projectId: number, issueId: number, body: UpdateIssueRequest) {
    return HttpHelper.put<UpdateIssueResponse>(`project/${projectId}/issue/${issueId}`, body)
  },
  deleteIssueRequest(projectId: number, issueId: number) {
    return HttpHelper.delete<DeleteIssueResponse>(`project/${projectId}/issue/${issueId}`)
  }
}

export default issueApi