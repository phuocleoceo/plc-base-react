import { BaseResponse, BaseParams } from '~/shared/types'

export type GetMemberForProjectParams = BaseParams & {
  withDeleted?: boolean
}

export type GetMemberForProjectResponse = BaseResponse<
  Array<{
    id: number
    email: string
    name: string
    avatar: string
    projectMemberId: number
  }>
>

export type DeleteProjectMemberResponse = BaseResponse<boolean>
