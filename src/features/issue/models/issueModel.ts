import { BaseResponse } from '~/shared/types'
import { IssueInBacklog, IssueInBoard, IssueDetail } from './issueType'

export type GetIssuesInBoardResponse = BaseResponse<
  Array<{
    projectStatusId: number
    issues: Array<IssueInBoard>
  }>
>

export type GetIssuesInBacklogResponse = BaseResponse<Array<IssueInBacklog>>

export type GetIssuesInSprintResponse = BaseResponse<Array<IssueInBacklog>>

export type GetIssueDetailResponse = BaseResponse<IssueDetail>

export type CreateIssueRequest = {
  title: string
  description: string
  storyPoint: number
  priority: string
  type: string
  assigneeId: number
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
