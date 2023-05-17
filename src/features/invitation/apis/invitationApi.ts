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

const invitationApi = {
  getInvitationForProject(projectId: number, params: GetInvitationForProjectParams) {
    return HttpHelper.get<GetInvitationForProjectResponse>(`project/${projectId}/invitation`, { params })
  },
  createInvitationForProject(projectId: number, body: CreateInvitationForProjectRequest) {
    return HttpHelper.post<CreateInvitationForProjectResponse>(`project/${projectId}/invitation`, body)
  },
  deleteInvitationForProject(projectId: number, invitationId: number) {
    return HttpHelper.delete<DeleteInvitationForProjectResponse>(`project/${projectId}/invitation/${invitationId}`)
  },
  getInvitationForUser(params: GetInvitationForUserParams) {
    return HttpHelper.get<GetInvitationForUserResponse>('user/personal/invitation', { params })
  },
  acceptInvitation(invitationId: number) {
    return HttpHelper.put<AcceptInvitationResponse>(`user/personal/invitation/${invitationId}/accept`)
  },
  declineInvitation(invitationId: number) {
    return HttpHelper.put<DeclineInvitationResponse>(`user/personal/invitation/${invitationId}/decline`)
  }
}

export default invitationApi
