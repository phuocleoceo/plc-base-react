import {
  GetIssuesInBoardParams,
  GetIssuesInBoardResponse,
  UpdateBoardIssueRequest,
  UpdateBoardIssueResponse,
  MoveIssueToBacklogRequest,
  MoveIssueToBacklogRespone,
  GetIssuesInBacklogParams,
  GetIssuesInBacklogResponse,
  UpdateBacklogIssueRequest,
  UpdateBacklogIssueResponse,
  MoveIssueToSprintRequest,
  MoveIssueToSprintRespone,
  GetIssueDetailResponse,
  CreateIssueRequest,
  CreateIssueResponse,
  UpdateIssueRequest,
  UpdateIssueResponse,
  DeleteIssueResponse
} from '~/features/issue/models'
import { HttpHelper } from '~/shared/helpers'

const issueApi = {
  // Board
  getIssuesInBoard(projectId: number, sprintId: number | undefined, params: GetIssuesInBoardParams) {
    if (!projectId || !sprintId) return
    return HttpHelper.get<GetIssuesInBoardResponse>(`project/${projectId}/board/${sprintId}/issue`, { params })
  },
  updateIssuesInBoard(projectId: number, issueId: number, body: UpdateBoardIssueRequest) {
    return HttpHelper.put<UpdateBoardIssueResponse>(`project/${projectId}/board/issue/${issueId}`, body)
  },
  moveIssueToBacklog(projectId: number, body: MoveIssueToBacklogRequest) {
    return HttpHelper.put<MoveIssueToBacklogRespone>(`project/${projectId}/board/issue/move-to-backlog`, body)
  },
  // Backlog
  getIssuesInBacklog(projectId: number, params: GetIssuesInBacklogParams) {
    return HttpHelper.get<GetIssuesInBacklogResponse>(`project/${projectId}/backlog/issue`, { params })
  },
  updateIssuesInBacklog(projectId: number, issueId: number, body: UpdateBacklogIssueRequest) {
    return HttpHelper.put<UpdateBacklogIssueResponse>(`project/${projectId}/backlog/issue/${issueId}`, body)
  },
  moveIssueToSprint(projectId: number, body: MoveIssueToSprintRequest) {
    return HttpHelper.put<MoveIssueToSprintRespone>(`project/${projectId}/backlog/issue/move-to-sprint`, body)
  },
  // Detail
  getIssueDetail(projectId: number, issueId: number) {
    return HttpHelper.get<GetIssueDetailResponse>(`project/${projectId}/issue/${issueId}`)
  },
  createIssue(projectId: number, body: CreateIssueRequest) {
    return HttpHelper.post<CreateIssueResponse>(`project/${projectId}/issue`, body)
  },
  updateIssue(projectId: number, issueId: number, body: UpdateIssueRequest) {
    return HttpHelper.put<UpdateIssueResponse>(`project/${projectId}/issue/${issueId}`, body)
  },
  deleteIssue(projectId: number, issueId: number) {
    return HttpHelper.delete<DeleteIssueResponse>(`project/${projectId}/issue/${issueId}`)
  }
}

export default issueApi
