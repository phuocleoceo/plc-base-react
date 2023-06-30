import { DatesSetArg, EventClickArg, EventSourceInput } from '@fullcalendar/core'
import { lazy, Suspense, useContext, useState } from 'react'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import { useParams } from 'react-router-dom'

import { GetEventInScheduleParams } from '~/features/event/models'
import { useProjectPermission } from '~/features/project/hooks'
import { SpinningCircle } from '~/common/components'
import { EventPermission } from '~/shared/enums'
import { EventApi } from '~/features/event/apis'
import { AppContext } from '~/common/contexts'
import { TimeHelper } from '~/shared/helpers'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'

const EventDetail = lazy(() => import('~/features/event/components/EventDetail'))
const CreateEvent = lazy(() => import('~/features/event/components/CreateEvent'))

export default function EventSchedule() {
  const projectId = Number(useParams().projectId)
  const { isAuthenticated } = useContext(AppContext)
  const { t } = useTranslation()

  const { hasPermission } = useProjectPermission(projectId)

  const { isShowing: isShowingEventDetail, toggle: toggleEventDetail } = useToggle()
  const { isShowing: isShowingCreateEvent, toggle: toggleCreateEvent } = useToggle()

  const [selectedEventId, setSelectedEventId] = useState<number>(-1)
  const [eventParams, setEventParams] = useState<GetEventInScheduleParams>({
    start: '',
    end: ''
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
      start: TimeHelper.toLocal(event.startTime),
      end: TimeHelper.toLocal(event.endTime),
      id: event.id.toString()
    })) ?? []

  const handleClickEvent = (event: EventClickArg) => {
    if (hasPermission(EventPermission.GetOne)) {
      const eventId = parseInt(event.event.id)
      setSelectedEventId(eventId)
      toggleEventDetail()
    }
  }

  const handleDates = (rangeInfo: DatesSetArg) => {
    setEventParams({
      start: rangeInfo.start?.toISOString() ?? new Date().toISOString(),
      end: rangeInfo.end?.toISOString() ?? new Date().toISOString()
    })
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
    <>
      <div className='p-4'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={'timeGridWeek'}
          customButtons={
            hasPermission(EventPermission.Create)
              ? {
                  createEventButton: {
                    text: t('create_event'),
                    click: () => hasPermission(EventPermission.Create) && toggleCreateEvent()
                  }
                }
              : {}
          }
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: 'timeGridDay,timeGridWeek,dayGridMonth createEventButton'
          }}
          height={'90vh'}
          events={events}
          eventClick={handleClickEvent}
          datesSet={handleDates}
          // weekends={false}
        />
      </div>

      {isShowingCreateEvent && (
        <Suspense>
          <CreateEvent {...{ projectId }} isShowing={isShowingCreateEvent} onClose={toggleCreateEvent} />
        </Suspense>
      )}

      {isShowingEventDetail && (
        <Suspense>
          <EventDetail
            {...{ projectId }}
            eventId={selectedEventId}
            isShowing={isShowingEventDetail}
            onClose={toggleEventDetail}
          />
        </Suspense>
      )}
    </>
  )
}
