import {
  GetEventInScheduleParams,
  GetEventInScheduleResponse,
  GetEventDetailResponse,
  CreateEventRequest,
  CreateEventResponse,
  UpdateEventRequest,
  UpdateEventResponse,
  DeleteEventResponse
} from '~/features/event/models'
import { HttpHelper } from '~/shared/helpers'

const eventApi = {
  getEventInSchedule(projectId: number, params: GetEventInScheduleParams) {
    return HttpHelper.get<GetEventInScheduleResponse>(`project/${projectId}/event`, { params })
  },
  getEventDetail(projectId: number, eventId: number) {
    return HttpHelper.get<GetEventDetailResponse>(`project/${projectId}/event/${eventId}`)
  },
  createEvent(projectId: number, body: CreateEventRequest) {
    return HttpHelper.post<CreateEventResponse>(`project/${projectId}/event`, body)
  },
  updateEvent(projectId: number, eventId: number, body: UpdateEventRequest) {
    return HttpHelper.put<UpdateEventResponse>(`project/${projectId}/event/${eventId}`, body)
  },
  deleteEvent(projectId: number, eventId: number) {
    return HttpHelper.delete<DeleteEventResponse>(`project/${projectId}/event/${eventId}`)
  }
}

export default eventApi
