import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { ProjectLayout } from '~/features/project/layouts'

const EventSchedule = lazy(() => import('~/features/event/pages/EventSchedule'))

export const eventRoute: RouteObject[] = [
  {
    path: 'event',
    element: (
      <ProjectLayout>
        <Suspense>
          <EventSchedule />
        </Suspense>
      </ProjectLayout>
    )
  }
]
