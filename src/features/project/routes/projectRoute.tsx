import { Outlet, RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { RequiredAuthenticatedRoute } from '~/common/routings/guardRoute'
import { projectInvitationRoute } from '~/features/invitation/routes'
import { projectMemberRoute } from '~/features/projectMember/routes'
import { projectBacklogRoute } from '~/features/backlog/routes'
import { ProjectProvider } from '~/features/project/contexts'
import { projectBoardRoute } from '~/features/board/routes'
import { ProjectLayout } from '~/features/project/layouts'
import { eventRoute } from '~/features/event/routes'
import { HomeLayout } from '~/features/home/layouts'

const ProjectList = lazy(() => import('~/features/project/pages/ProjectList'))
const ProjectSetting = lazy(() => import('~/features/project/pages/ProjectSetting'))

export const projectRoute: RouteObject[] = [
  {
    path: 'project',
    element: <RequiredAuthenticatedRoute />,
    children: [
      {
        path: '',
        element: (
          <HomeLayout>
            <Suspense>
              <ProjectList />
            </Suspense>
          </HomeLayout>
        )
      },
      {
        path: ':projectId',
        element: (
          <ProjectProvider>
            <Outlet />
          </ProjectProvider>
        ),
        children: [
          {
            path: 'setting',
            element: (
              <ProjectLayout>
                <Suspense>
                  <ProjectSetting />
                </Suspense>
              </ProjectLayout>
            )
          },
          ...projectBoardRoute,
          ...projectBacklogRoute,
          ...projectMemberRoute,
          ...projectInvitationRoute,
          ...eventRoute
        ]
      }
    ]
  }
]
