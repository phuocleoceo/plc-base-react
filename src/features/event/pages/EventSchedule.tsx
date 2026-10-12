import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/classic/theme.css'
import '@fullcalendar/react/themes/classic/palette.css'

import FullCalendar, { DatesSetInfo, EventClickInfo, EventSourceInput } from '@fullcalendar/react'
import classicThemePlugin from '@fullcalendar/react/themes/classic'
import interactionPlugin from '@fullcalendar/react/interaction'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import { lazy, Suspense, useContext, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
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

  const { data: eventData, isPending: isLoadingEvent } = useQuery({
    queryKey: [QueryKey.EventSchedule, eventParams],
    queryFn: () => EventApi.getEventInSchedule(projectId, eventParams),
    placeholderData: keepPreviousData,
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

  const handleClickEvent = (event: EventClickInfo) => {
    if (hasPermission(EventPermission.GetOne)) {
      const eventId = parseInt(event.event.id)
      setSelectedEventId(eventId)
      toggleEventDetail()
    }
  }

  const handleDates = (rangeInfo: DatesSetInfo) => {
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
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, classicThemePlugin]}
          initialView={'timeGridWeek'}
          buttons={
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
