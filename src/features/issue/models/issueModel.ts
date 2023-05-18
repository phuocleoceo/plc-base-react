import { BaseResponse, BaseParams } from '~/shared/types'

export type GetInvitationForProjectParams = BaseParams & {
  stillValid: boolean
}

export type GetIssuesInBacklogResponse = BaseResponse<
  Array<{
    id: number
    title: string
    description: string
    storyPoint: number
    priority: string
    type: string
    backlogIndex: number
    sprintId: number
    reporterId: number
    reporterName: string
    reporterAvatar: string
    assigneeId: number
    assigneeName: string
    assigneeAvatar: string
    projectStatusId: number
    projectStatusName: string
  }>
>

export type GetIssuesInSprintResponse = BaseResponse<
  Array<{
    id: number
    title: string
    description: string
    storyPoint: number
    priority: string
    type: string
    backlogIndex: number
    sprintId: number
    reporterId: number
    reporterName: string
    reporterAvatar: string
    assigneeId: number
    assigneeName: string
    assigneeAvatar: string
    projectStatusId: number
    projectStatusName: string
  }>
>

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
