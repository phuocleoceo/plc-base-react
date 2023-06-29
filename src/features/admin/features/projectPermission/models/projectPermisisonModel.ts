import { BaseResponse } from '~/shared/types'
import { ProjectPermissionGroup } from './projectPermissionType'

export type GetProjectPermissionResponse = BaseResponse<Array<ProjectPermissionGroup>>

export type CreateProjectPermissionRequest = {
  key: string
}

export type CreateProjectPermissionResponse = BaseResponse<boolean>

export type DeleteProjectPermissionResponse = BaseResponse<boolean>
