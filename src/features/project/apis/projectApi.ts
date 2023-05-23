import {
  GetProjectsParams,
  GetProjectsResponse,
  GetProjectResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  DeleteProjectResponse
} from '~/features/project/models'
import { HttpHelper } from '~/shared/helpers'

const projectApi = {
  getProjects(params: GetProjectsParams) {
    return HttpHelper.get<GetProjectsResponse>('project', { params })
  },
  getProjectById(projectId: number) {
    return HttpHelper.get<GetProjectResponse>(`project/${projectId}`)
  },
  createProject(body: CreateProjectRequest) {
    return HttpHelper.post<CreateProjectResponse>('project', body)
  },
  updateProject(projectId: number, body: UpdateProjectRequest) {
    return HttpHelper.put<UpdateProjectResponse>(`project/${projectId}`, body)
  },
  deleteProject(projectId: number) {
    return HttpHelper.delete<DeleteProjectResponse>(`project/${projectId}`)
  }
}

export default projectApi
