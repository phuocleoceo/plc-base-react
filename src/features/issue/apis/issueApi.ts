import {
  GetIssuesInBoardParams,
  GetIssuesInBoardResponse,
  GetIssuesInBacklogResponse,
  GetIssuesInSprintResponse,
  GetIssueDetailResponse,
  CreateIssueRequest,
  CreateIssueResponse,
  UpdateIssueRequest,
  UpdateIssueResponse,
  DeleteIssueResponse
} from '~/features/issue/models'
import { HttpHelper } from '~/shared/helpers'

const issueApi = {
  getIssuesInBoard(projectId: number, params: GetIssuesInBoardParams) {
    return HttpHelper.get<GetIssuesInBoardResponse>(`project/${projectId}/board/issue`, { params })
  },
  getIssuesInBacklog(projectId: number) {
    return HttpHelper.get<GetIssuesInBacklogResponse>(`project/${projectId}/backlog/issue`)
  },
  getIssuesInSprint(projectId: number) {
    return HttpHelper.get<GetIssuesInSprintResponse>(`project/${projectId}/sprint/issue`)
  },
  getIssueDetail(projectId: number, issueId: number) {
    return HttpHelper.get<GetIssueDetailResponse>(`project/${projectId}/issue/${issueId}`)
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
