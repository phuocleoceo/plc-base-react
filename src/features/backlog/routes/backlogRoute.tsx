import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { BacklogProvider } from '~/features/backlog/contexts'
import { ProjectLayout } from '~/features/project/layouts'

const ProjectBacklog = lazy(() => import('~/features/backlog/pages/ProjectBacklog'))

export const projectBacklogRoute: RouteObject[] = [
  {
    path: 'backlog',
    element: (
      <ProjectLayout>
        <Suspense>
          <BacklogProvider>
            <ProjectBacklog />
          </BacklogProvider>
        </Suspense>
      </ProjectLayout>
    )
  }
]
