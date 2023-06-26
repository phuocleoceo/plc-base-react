import { EventDetail, EventInSchedule } from './eventType'
import { BaseResponse } from '~/shared/types'

export type GetEventInScheduleParams = {
  start: string
  end: string
}

export type GetEventInScheduleResponse = BaseResponse<Array<EventInSchedule>>

export type GetEventDetailResponse = BaseResponse<EventDetail>

export type CreateEventRequest = {
  title: string
  description: string
  startTime: Date
  endTime: Date
  attendeeIds: number[]
}

export type CreateEventResponse = BaseResponse<boolean>

export type UpdateEventRequest = {
  title: string
  description: string
  startTime: Date
  endTime: Date
  attendeeIds: number[]
}

export type UpdateEventResponse = BaseResponse<boolean>

export type DeleteEventResponse = BaseResponse<boolean>
