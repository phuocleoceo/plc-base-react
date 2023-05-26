import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { ProjectLayout } from '~/features/project/layouts'

const ProjectMember = lazy(() => import('~/features/projectMember/pages/ProjectMember'))

export const projectMemberRoute: RouteObject[] = [
  {
    path: 'member',
    element: (
      <ProjectLayout>
        <Suspense>
          <ProjectMember />
        </Suspense>
      </ProjectLayout>
    )
  }
]
