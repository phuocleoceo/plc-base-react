import { BaseResponse, PagedResponse } from '~/shared/types'

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

export type GetInvitationForUserResponse = PagedResponse<{
  invitationId: number
  recipientId: number
  recipientName: string
  recipientEmail: string
  recipientAvatar: string
  acceptedAt: Date
  declinedAt: Date
}>

export type AcceptInvitationResponse = BaseResponse<boolean>

export type DeclineInvitationResponse = BaseResponse<boolean>
