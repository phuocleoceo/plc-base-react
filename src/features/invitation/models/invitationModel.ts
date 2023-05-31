import { BaseResponse, PagedResponse, BaseParams } from '~/shared/types'
import { ProjectInvitation, UserInvitation } from './invitationType'

export type GetInvitationForProjectParams = BaseParams & {
  stillValid: boolean
}

export type GetInvitationForProjectResponse = PagedResponse<ProjectInvitation>

export type CreateInvitationForProjectRequest = {
  recipientEmail: string
}

export type CreateInvitationForProjectResponse = BaseResponse<boolean>

export type DeleteInvitationForProjectResponse = BaseResponse<boolean>

export type GetInvitationForUserParams = BaseParams & {
  stillValid: boolean
}

export type GetInvitationForUserResponse = PagedResponse<UserInvitation>

export type AcceptInvitationResponse = BaseResponse<boolean>

export type DeclineInvitationResponse = BaseResponse<boolean>
