import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { ProjectLayout } from '~/features/project/layouts'

const ProjectMemberList = lazy(() => import('~/features/projectMember/pages/ProjectMemberList'))

export const projectMemberRoute: RouteObject[] = [
  {
    path: 'member',
    element: (
      <ProjectLayout>
        <Suspense>
          <ProjectMemberList />
        </Suspense>
      </ProjectLayout>
    )
  }
]
