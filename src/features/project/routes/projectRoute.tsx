import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { RequiredAuthenticatedRoute } from '~/common/routings/guardRoute'
import { projectInvitationRoute } from '~/features/invitation/routes'
import { projectMemberRoute } from '~/features/projectMember/routes'
import { ProjectLayout } from '~/features/project/layouts'
import { HomeLayout } from '~/features/home/layouts'

const ProjectList = lazy(() => import('~/features/project/pages/ProjectList'))
const ProjectBoard = lazy(() => import('~/features/project/pages/ProjectBoard'))
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
        children: [
          {
            path: 'board',
            element: (
              <ProjectLayout>
                <Suspense>
                  <ProjectBoard />
                </Suspense>
              </ProjectLayout>
            )
          },
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
          ...projectMemberRoute,
          ...projectInvitationRoute
        ]
      }
    ]
  }
]
