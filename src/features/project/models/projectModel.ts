import { BaseResponse } from '~/shared/types'

export type GetProjectResponse = BaseResponse<
  Array<{
    id: number
    name: string
    image: string
    key: string
    creatorId: number
    leaderId: number
    createdAt: Date
    updatedAt: Date
  }>
>

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
