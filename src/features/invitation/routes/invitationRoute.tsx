import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { ProjectLayout } from '~/features/project/layouts'

const ProjectInvitationList = lazy(() => import('~/features/invitation/pages/ProjectInvitationList'))

export const projectInvitationRoute: RouteObject[] = [
  {
    path: 'invitation',
    element: (
      <ProjectLayout>
        <Suspense>
          <ProjectInvitationList />
        </Suspense>
      </ProjectLayout>
    )
  }
]

export const userInvitationRoute: RouteObject[] = []
