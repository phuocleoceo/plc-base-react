import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { ProjectLayout } from '~/features/project/layouts'

const ProjectBoard = lazy(() => import('~/features/board/pages/ProjectBoard'))

export const adminRoute: RouteObject[] = [
  {
    path: 'admin',
    element: (
      <ProjectLayout>
        <Suspense>
          <ProjectBoard />
        </Suspense>
      </ProjectLayout>
    )
  }
]
