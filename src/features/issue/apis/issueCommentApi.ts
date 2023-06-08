import {
  GetIssueCommentsParams,
  GetIssueCommentsResponse,
  CreateIssueCommentRequest,
  CreateIssueCommentResponse,
  UpdateIssueCommentRequest,
  UpdateIssueCommentResponse,
  DeleteIssueCommentResponse
} from '~/features/issue/models'
import { HttpHelper } from '~/shared/helpers'

const issueCommentApi = {
  getCommentsForIssue(issueId: number, params: GetIssueCommentsParams) {
    return HttpHelper.get<GetIssueCommentsResponse>(`issue/${issueId}/comment`, { params })
  },
  createIssueComment(issueId: number, body: CreateIssueCommentRequest) {
    return HttpHelper.post<CreateIssueCommentResponse>(`issue/${issueId}/comment`, body)
  },
  updateIssueComment(issueId: number, commentId: number, body: UpdateIssueCommentRequest) {
    return HttpHelper.put<UpdateIssueCommentResponse>(`issue/${issueId}/comment/${commentId}`, body)
  },
  deleteIssueComment(issueId: number, commentId: number) {
    return HttpHelper.delete<DeleteIssueCommentResponse>(`issue/${issueId}/comment/${commentId}`)
  }
}

export default issueCommentApi
