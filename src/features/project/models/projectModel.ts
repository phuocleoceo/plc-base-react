import { BaseParams, BaseResponse, PagedResponse } from '~/shared/types'
import { Project } from './projectType'

export type GetProjectsParams = BaseParams & {
  searchValue: string
}

export type GetProjectsResponse = PagedResponse<Project>

export type GetProjectResponse = BaseResponse<Project>

export type GetUserPermissionInProjectResponse = BaseResponse<Array<string>>

export type CreateProjectRequest = {
  name: string
  image: string
  key: string
}

export type CreateProjectResponse = BaseResponse<boolean>

export type UpdateProjectRequest = {
  name: string
  image: string
  key: string
  leaderId: number
}

export type UpdateProjectResponse = BaseResponse<boolean>

export type DeleteProjectResponse = BaseResponse<boolean>
