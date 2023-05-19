import {
  CreateSprintRequest,
  CreateSprintResponse,
  UpdateSprintRequest,
  UpdateSprintResponse,
  DeleteSprintResponse,
  StartSprintResponse,
  CompleteSprintResponse
} from '~/features/sprint/models'
import { HttpHelper } from '~/shared/helpers'

const sprintApi = {
  createSprint(projectId: number, body: CreateSprintRequest) {
    return HttpHelper.post<CreateSprintResponse>(`project/${projectId}/sprint`, body)
  },
  updateSprint(projectId: number, sprintId: number, body: UpdateSprintRequest) {
    return HttpHelper.put<UpdateSprintResponse>(`project/${projectId}/sprint/${sprintId}`, body)
  },
  deleteSprint(projectId: number, sprintId: number) {
    return HttpHelper.delete<DeleteSprintResponse>(`project/${projectId}/sprint/${sprintId}`)
  },
  startSprint(projectId: number, sprintId: number) {
    return HttpHelper.put<StartSprintResponse>(`project/${projectId}/sprint/${sprintId}/start`)
  },
  completeSprint(projectId: number, sprintId: number) {
    return HttpHelper.put<CompleteSprintResponse>(`project/${projectId}/sprint/${sprintId}/complete`)
  }
}

export default sprintApi
