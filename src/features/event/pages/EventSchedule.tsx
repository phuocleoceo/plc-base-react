import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'

import { GetEventInScheduleParams } from '~/features/event/models'
import { SpinningCircle } from '~/common/components'
import { EventApi } from '~/features/event/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { EventClickArg, EventSourceInput } from '@fullcalendar/core'

export default function EventSchedule() {
  const projectId = Number(useParams().projectId)
  const { isAuthenticated } = useContext(AppContext)
  const { t } = useTranslation()

  const [eventParams, setEventParams] = useState<GetEventInScheduleParams>({
    month: 6,
    year: 2023
  })

  const { data: eventData, isLoading: isLoadingEvent } = useQuery({
    queryKey: [QueryKey.EventSchedule, eventParams],
    queryFn: () => EventApi.getEventInSchedule(projectId, eventParams),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const events: EventSourceInput =
    eventData?.data.data.map((event) => ({
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      id: event.id.toString()
    })) ?? []

  const handleClickEvent = (event: EventClickArg) => {
    const eventId = parseInt(event.event.id)
    console.log(eventId)
  }

  if (isLoadingEvent)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 {t('loading_events')}...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <div className='p-4'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={'timeGridWeek'}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'timeGridDay,timeGridWeek,dayGridMonth'
        }}
        height={'90vh'}
        events={events}
        eventClick={handleClickEvent}
      />
    </div>
  )
}
