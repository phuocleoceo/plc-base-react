import {
  GetProjectPermissionResponse,
  CreateProjectPermissionRequest,
  CreateProjectPermissionResponse,
  DeleteProjectPermissionResponse
} from '~/features/admin/features/projectPermission/models'
import { HttpHelper } from '~/shared/helpers'

const projectPermissionApi = {
  getProjectPermission(projectRoleId: number) {
    return HttpHelper.get<GetProjectPermissionResponse>(`project-role/${projectRoleId}/project-permission`)
  },
  createProjectPermission(projectRoleId: number, body: CreateProjectPermissionRequest) {
    return HttpHelper.post<CreateProjectPermissionResponse>(`project-role/${projectRoleId}/project-permission`, body)
  },
  deleteProjectPermission(projectRoleId: number, projectPermissionKey: string) {
    return HttpHelper.delete<DeleteProjectPermissionResponse>(
      `project-role/${projectRoleId}/project-permission/${projectPermissionKey}`
    )
  }
}

export default projectPermissionApi
