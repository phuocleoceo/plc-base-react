import { IssueInBacklog, IssueDetail, IssueGroupedInBoard } from './issueType'
import { BaseResponse } from '~/shared/types'

// Board
export type GetIssuesInBoardParams = {
  searchValue?: string
  assignees?: string
}

export type GetIssuesInBoardResponse = BaseResponse<Array<IssueGroupedInBoard>>

export type UpdateBoardIssueRequest = {
  projectStatusId: number
  projectStatusIndex: number
}

export type UpdateBoardIssueResponse = BaseResponse<boolean>

export type MoveIssueToBacklogRequest = {
  issues: Array<number>
}

export type MoveIssueToBacklogRespone = BaseResponse<boolean>

// Backlog
export type GetIssuesInBacklogParams = {
  searchValue?: string
  assignees?: string
}

export type GetIssuesInBacklogResponse = BaseResponse<Array<IssueInBacklog>>

export type UpdateBacklogIssueRequest = {
  backlogIndex: number
}

export type UpdateBacklogIssueResponse = BaseResponse<boolean>

export type MoveIssueToSprintRequest = {
  issues: Array<number>
}

export type MoveIssueToSprintRespone = BaseResponse<boolean>

// Detail
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
  reporterId: number
  assigneeId: number | null
}

export type UpdateIssueResponse = BaseResponse<boolean>

export type DeleteIssueResponse = BaseResponse<boolean>
