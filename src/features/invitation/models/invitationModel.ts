import { BaseResponse, PagedResponse, BaseParams } from '~/shared/types'

export type GetInvitationForProjectParams = BaseParams & {
  stillValid: boolean
}

export type GetInvitationForProjectResponse = PagedResponse<{
  invitationId: number
  recipientId: number
  recipientName: string
  recipientEmail: string
  recipientAvatar: string
  acceptedAt: Date
  declinedAt: Date
}>

export type CreateInvitationForProjectRequest = {
  recipientEmail: string
}

export type CreateInvitationForProjectResponse = BaseResponse<boolean>

export type DeleteInvitationForProjectResponse = BaseResponse<boolean>

export type GetInvitationForUserParams = BaseParams & {
  stillValid: boolean
}

export type GetInvitationForUserResponse = PagedResponse<{
  invitationId: number
  senderId: number
  senderName: string
  senderEmail: string
  senderAvatar: string
  projectId: number
  projectName: string
  projectImage: string
  acceptedAt: Date
  declinedAt: Date
}>

export type AcceptInvitationResponse = BaseResponse<boolean>

export type DeclineInvitationResponse = BaseResponse<boolean>
