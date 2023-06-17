import { BaseParams, BaseResponse, PagedResponse } from '~/shared/types'
import { ProjectRole } from './projectRoleType'

export type GetAllProjectRolesResponse = BaseResponse<Array<ProjectRole>>

export type GetProjectRolesParams = BaseParams

export type GetProjectRolesResponse = PagedResponse<ProjectRole>

export type GetProjectRoleResponse = BaseResponse<ProjectRole>

export type CreateProjectRoleRequest = {
  name: string
  description: string
}

export type CreateProjectRoleResponse = BaseResponse<boolean>

export type UpdateProjectRoleRequest = {
  name: string
  description: string
}

export type UpdateProjectRoleResponse = BaseResponse<boolean>

export type DeleteProjectRoleResponse = BaseResponse<boolean>
