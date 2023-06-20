import { BaseResponse } from '~/shared/types'

export type GetMemberRolesResponse = BaseResponse<
  Array<{
    id: number
    projectMemberId: number
    projectRoleId: number
  }>
>

export type CreateMemberRoleRequest = {
  projectMemberId: number
  projectRoleId: number
}

export type CreateMemberRoleResponse = BaseResponse<boolean>

export type DeleteMemberRoleResponse = BaseResponse<boolean>
