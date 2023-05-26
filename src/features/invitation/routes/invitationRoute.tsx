import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { ProjectLayout } from '~/features/project/layouts'

const InvitationList = lazy(() => import('~/features/invitation/pages/InvitationList'))

export const invitationRoute: RouteObject[] = [
  {
    path: 'invitation',
    element: (
      <ProjectLayout>
        <Suspense>
          <InvitationList />
        </Suspense>
      </ProjectLayout>
    )
  }
]
