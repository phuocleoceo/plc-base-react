import { BaseParams, BaseResponse, PagedResponse } from '~/shared/types'
import { IssueComment } from './issueCommentType'

export type GetIssueCommentsParams = BaseParams

export type GetIssueCommentsResponse = PagedResponse<IssueComment>

export type CreateIssueCommentRequest = {
  content: string
}

export type CreateIssueCommentResponse = BaseResponse<boolean>

export type UpdateIssueCommentRequest = {
  content: string
}

export type UpdateIssueCommentResponse = BaseResponse<boolean>

export type DeleteIssueCommentResponse = BaseResponse<boolean>
