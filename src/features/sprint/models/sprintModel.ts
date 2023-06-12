import { BaseResponse } from '~/shared/types'
import { Sprint } from './sprintType'

export type GetSprintResponse = BaseResponse<Sprint>

export type CreateSprintRequest = {
  title: string
  goal: string
  fromDate: Date
  toDate: Date
}

export type CreateSprintResponse = BaseResponse<boolean>

export type UpdateSprintRequest = {
  title: string
  goal: string
  fromDate: Date
  toDate: Date
}

export type UpdateSprintResponse = BaseResponse<boolean>

export type DeleteSprintResponse = BaseResponse<boolean>

export type StartSprintResponse = BaseResponse<boolean>

export type CompleteSprintResponse = BaseResponse<boolean>
