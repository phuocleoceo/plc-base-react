import {
  CreateProjectRequest,
  CreateProjectResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  DeleteProjectResponse
} from '~/features/project/models'
import { HttpHelper } from '~/shared/helpers'

export function createProject(body: CreateProjectRequest) {
  return HttpHelper.post<CreateProjectResponse>('project', body)
}

export function updateProject(projectId: number, body: UpdateProjectRequest) {
  return HttpHelper.put<UpdateProjectResponse>(`project/${projectId}`, body)
}

export function deleteProject(projectId: number) {
  return HttpHelper.delete<DeleteProjectResponse>(`project/${projectId}`)
}
