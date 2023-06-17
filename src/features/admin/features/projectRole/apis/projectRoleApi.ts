import {
  GetAllProjectRolesResponse,
  GetProjectRolesParams,
  GetProjectRolesResponse,
  GetProjectRoleResponse,
  CreateProjectRoleRequest,
  CreateProjectRoleResponse,
  UpdateProjectRoleRequest,
  UpdateProjectRoleResponse,
  DeleteProjectRoleResponse
} from '~/features/admin/features/projectRole/models'
import { HttpHelper } from '~/shared/helpers'

const projectRoleApi = {
  getAllProjectRoles() {
    return HttpHelper.get<GetAllProjectRolesResponse>('project-role/all')
  },
  getProjectRoles(params: GetProjectRolesParams) {
    return HttpHelper.get<GetProjectRolesResponse>('project-role', { params })
  },
  getProjectRole(projectRoleId: number) {
    return HttpHelper.get<GetProjectRoleResponse>(`project-role/${projectRoleId}`)
  },
  createProjectRole(body: CreateProjectRoleRequest) {
    return HttpHelper.post<CreateProjectRoleResponse>('project-role', body)
  },
  updateProjectRole(projectRoleId: number, body: UpdateProjectRoleRequest) {
    return HttpHelper.put<UpdateProjectRoleResponse>(`project-role/${projectRoleId}`, body)
  },
  deleteProjectRole(projectRoleId: number) {
    return HttpHelper.delete<DeleteProjectRoleResponse>(`project-role/${projectRoleId}`)
  }
}

export default projectRoleApi
