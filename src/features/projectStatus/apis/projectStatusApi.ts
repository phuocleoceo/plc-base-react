import {
  GetProjectStatusResponse,
  CreateProjectStatusRequest,
  CreateProjectStatusResponse,
  UpdateProjectStatusRequest,
  UpdateProjectStatusResponse,
  DeleteProjectStatusResponse
} from '~/features/projectStatus/models'
import { HttpHelper } from '~/shared/helpers'

const projectStatusApi = {
  getProjectStatus(projectId: number) {
    return HttpHelper.get<GetProjectStatusResponse>(`project/${projectId}/status`)
  },
  createProjectStatus(projectId: number, body: CreateProjectStatusRequest) {
    return HttpHelper.post<CreateProjectStatusResponse>(`project/${projectId}/status`, body)
  },
  updateProjectStatus(projectId: number, projectStatusId: number, body: UpdateProjectStatusRequest) {
    return HttpHelper.put<UpdateProjectStatusResponse>(`project/${projectId}/status/${projectStatusId}`, body)
  },
  deleteProjectStatus(projectId: number, projectStatusId: number) {
    return HttpHelper.delete<DeleteProjectStatusResponse>(`project/${projectId}/status/${projectStatusId}`)
  }
}

export default projectStatusApi
