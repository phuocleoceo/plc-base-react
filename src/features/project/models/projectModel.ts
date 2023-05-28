import { BaseParams, BaseResponse, PagedResponse } from '~/shared/types'

export type GetProjectsParams = BaseParams & {
  searchValue: string
}

export type GetProjectsResponse = PagedResponse<{
  id: number
  name: string
  image: string
  key: string
  creatorId: number
  leaderId: number
  leaderName: string
  leaderAvatar: string
  createdAt: Date
  updatedAt: Date
}>

export type GetProjectResponse = BaseResponse<{
  id: number
  name: string
  image: string
  key: string
  creatorId: number
  leaderId: number
  leaderName: string
  leaderAvatar: string
  createdAt: Date
  updatedAt: Date
}>

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
