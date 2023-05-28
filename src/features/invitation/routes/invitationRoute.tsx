import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { RequiredAuthenticatedRoute } from '~/common/routings/guardRoute'
import { ProjectLayout } from '~/features/project/layouts'
import { HomeLayout } from '~/features/home/layouts'

const ProjectInvitationList = lazy(() => import('~/features/invitation/pages/ProjectInvitationList'))
const UserInvitationList = lazy(() => import('~/features/invitation/pages/UserInvitationList'))

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

export const userInvitationRoute: RouteObject[] = [
  {
    path: 'user/invitation',
    element: <RequiredAuthenticatedRoute />,
    children: [
      {
        path: '',
        element: (
          <HomeLayout>
            <Suspense>
              <UserInvitationList />
            </Suspense>
          </HomeLayout>
        )
      }
    ]
  }
]
