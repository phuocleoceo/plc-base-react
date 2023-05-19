import { BaseResponse } from '~/shared/types'

export type CreateSprintRequest = {
  title: string
  goal: string
  startTime: Date
  endTime: Date
}

export type CreateSprintResponse = BaseResponse<boolean>

export type UpdateSprintRequest = {
  title: string
  goal: string
  startTime: Date
  endTime: Date
}

export type UpdateSprintResponse = BaseResponse<boolean>

export type DeleteSprintResponse = BaseResponse<boolean>

export type StartSprintResponse = BaseResponse<boolean>

export type CompleteSprintResponse = BaseResponse<boolean>
