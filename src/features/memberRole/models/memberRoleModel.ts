import { BaseResponse } from '~/shared/types'
import { MemberRole } from './memberRoleType'

export type GetMemberRolesResponse = BaseResponse<Array<MemberRole>>

export type CreateMemberRoleRequest = {
  projectMemberId: number
  projectRoleId: number
}

export type CreateMemberRoleResponse = BaseResponse<boolean>

export type DeleteMemberRoleParams = {
  projectMemberId: number
  projectRoleId: number
}

export type DeleteMemberRoleResponse = BaseResponse<boolean>
