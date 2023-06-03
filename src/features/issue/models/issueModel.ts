import { IssueInBacklog, IssueDetail, IssueGroupedInBoard } from './issueType'
import { BaseResponse } from '~/shared/types'

export type GetIssuesInBoardParams = {
  searchValue?: string
  assignees?: string
}

export type GetIssuesInBoardResponse = BaseResponse<Array<IssueGroupedInBoard>>

export type GetIssuesInBacklogParams = {
  searchValue?: string
  assignees?: string
}

export type GetIssuesInBacklogResponse = BaseResponse<Array<IssueInBacklog>>

export type GetIssuesInSprintResponse = BaseResponse<Array<IssueInBacklog>>

export type GetIssueDetailResponse = BaseResponse<IssueDetail>

export type CreateIssueRequest = {
  title: string
  description: string
  storyPoint: number
  priority: string
  type: string
  assigneeId: number | null
}

export type CreateIssueResponse = BaseResponse<boolean>

export type UpdateIssueRequest = {
  title: string
  description: string
  storyPoint: number
  priority: string
  type: string
  backlogIndex: number
  reporterId: number
  assigneeId: number
  projectStatusId: number
  projectStatusIndex: number
  sprintId: number
}

export type UpdateIssueResponse = BaseResponse<boolean>

export type DeleteIssueResponse = BaseResponse<boolean>
