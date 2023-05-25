import { RouteObject } from 'react-router-dom'

import { ProjectList, ProjectBoard, ProjectSetting } from '~/features/project/pages'
import { RequiredAuthenticatedRoute } from '~/common/routings/guardRoute'
import { projectMemberRoute } from '~/features/projectMember/routes'
import { HomeLayout } from '~/features/home/layouts'
import { ProjectLayout } from '../layouts'

export const projectRoute: RouteObject[] = [
  {
    path: 'project',
    element: <RequiredAuthenticatedRoute />,
    children: [
      {
        path: '',
        element: (
          <HomeLayout>
            <ProjectList />
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
                <ProjectBoard />
              </ProjectLayout>
            )
          },
          {
            path: 'setting',
            element: (
              <ProjectLayout>
                <ProjectSetting />
              </ProjectLayout>
            )
          },
          ...projectMemberRoute
        ]
      }
    ]
  }
]
