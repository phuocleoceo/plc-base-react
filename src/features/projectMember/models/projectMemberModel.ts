import { BaseResponse } from '~/shared/types'

export type GetMemberForProjectParams = {
  searchValue?: string
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
