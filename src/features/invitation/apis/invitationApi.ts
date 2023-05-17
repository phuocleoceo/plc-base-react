import {
  GetInvitationForProjectParams,
  GetInvitationForProjectResponse,
  CreateInvitationForProjectRequest,
  CreateInvitationForProjectResponse,
  DeleteInvitationForProjectResponse,
  GetInvitationForUserParams,
  GetInvitationForUserResponse,
  AcceptInvitationResponse,
  DeclineInvitationResponse
} from '~/features/invitation/models'
import { HttpHelper } from '~/shared/helpers'

export function getInvitationForProject(projectId: number, params: GetInvitationForProjectParams) {
  return HttpHelper.get<GetInvitationForProjectResponse>(`project/${projectId}/invitation`, { params })
}

export function createInvitationForProject(projectId: number, body: CreateInvitationForProjectRequest) {
  return HttpHelper.post<CreateInvitationForProjectResponse>(`project/${projectId}/invitation`, body)
}

export function deleteInvitationForProject(projectId: number, invitationId: number) {
  return HttpHelper.delete<DeleteInvitationForProjectResponse>(`project/${projectId}/invitation/${invitationId}`)
}

export function getInvitationForUser(params: GetInvitationForUserParams) {
  return HttpHelper.get<GetInvitationForUserResponse>('user/personal/invitation', { params })
}

export function acceptInvitation(invitationId: number) {
  return HttpHelper.put<AcceptInvitationResponse>(`user/personal/invitation/${invitationId}/accept`)
}

export function declineInvitation(invitationId: number) {
  return HttpHelper.put<DeclineInvitationResponse>(`user/personal/invitation/${invitationId}/decline`)
}
