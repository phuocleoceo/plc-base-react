import { BaseParams, BaseResponse, PagedResponse } from '~/shared/types'
import { ProjectMember } from './projectMemberType'

export type GetMemberForProjectParams = BaseParams & {
  withDeleted?: boolean
}

export type GetMemberForProjectResponse = PagedResponse<ProjectMember>

export type GetMemberForSelectResponse = BaseResponse<
  Array<{
    id: number
    name: string
    avatar: string
  }>
>

export type DeleteProjectMemberResponse = BaseResponse<boolean>

export type LeaveProjectResponse = BaseResponse<boolean>
