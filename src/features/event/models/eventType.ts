export type EventInSchedule = {
  id: number
  title: string
  startTime: Date
  endTime: Date
}

export type EventDetail = {
  id: number
  title: string
  description: string
  creatorId: number
  startTime: Date
  endTime: Date
  createdAt: Date
  updatedAt: Date
  attendees: Attendee[]
}

export type Attendee = {
  id: number
  email: string
  name: string
  avatar: string
  attendeeId: number
}
