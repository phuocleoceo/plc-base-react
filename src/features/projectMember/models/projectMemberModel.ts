import { BaseParams, BaseResponse, PagedResponse } from '~/shared/types'

export type GetMemberForProjectParams = BaseParams & {
  withDeleted?: boolean
}

export type GetMemberForProjectResponse = PagedResponse<{
  id: number
  email: string
  name: string
  avatar: string
  projectMemberId: number
}>

export type GetMemberForSelectResponse = BaseResponse<
  Array<{
    id: number
    name: string
    avatar: string
  }>
>

export type DeleteProjectMemberResponse = BaseResponse<boolean>
