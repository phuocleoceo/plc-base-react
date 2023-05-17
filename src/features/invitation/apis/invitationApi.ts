import {
  GetInvitationForProjectResponse,
  CreateInvitationForProjectRequest,
  CreateInvitationForProjectResponse,
  DeleteInvitationForProjectResponse,
  GetInvitationForUserResponse,
  AcceptInvitationResponse,
  DeclineInvitationResponse
} from '~/features/invitation/models'
import { HttpHelper } from '~/shared/helpers'

export function getInvitationForProject(projectId: number) {
  return HttpHelper.get<GetInvitationForProjectResponse>(`project/${projectId}/invitation`)
}

export function createInvitationForProject(projectId: number, body: CreateInvitationForProjectRequest) {
  return HttpHelper.post<CreateInvitationForProjectResponse>(`project/${projectId}/invitation`, body)
}

export function deleteInvitationForProject(projectId: number, invitationId: number) {
  return HttpHelper.delete<DeleteInvitationForProjectResponse>(`project/${projectId}/invitation/${invitationId}`)
}

export function getInvitationForUser() {
  return HttpHelper.get<GetInvitationForUserResponse>('user/personal/invitation')
}

export function acceptInvitation(invitationId: number) {
  return HttpHelper.put<AcceptInvitationResponse>(`user/personal/invitation/${invitationId}/accept`)
}

export function declineInvitation(invitationId: number) {
  return HttpHelper.put<DeclineInvitationResponse>(`user/personal/invitation/${invitationId}/decline`)
}
