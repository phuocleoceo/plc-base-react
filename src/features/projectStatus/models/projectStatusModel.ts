import { BaseResponse } from '~/shared/types'

export type CreateProjectStatusRequest = {
  name: string
}

export type CreateProjectStatusResponse = BaseResponse<boolean>

export type UpdateProjectStatusRequest = {
  name: string
  index: number
}

export type UpdateProjectStatusResponse = BaseResponse<boolean>

export type DeleteProjectStatusResponse = BaseResponse<boolean>