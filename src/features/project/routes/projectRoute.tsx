import { RouteObject } from 'react-router-dom'

import { RequiredAuthenticatedRoute } from '~/common/routings/guardRoute'
import { ProjectList } from '~/features/project/pages'
import { HomeLayout } from '~/features/home/layouts'

export const projectRoute: RouteObject[] = [
  {
    path: '/project',
    element: <RequiredAuthenticatedRoute />,
    children: [
      {
        path: '',
        element: (
          <HomeLayout>
            <ProjectList />
          </HomeLayout>
        )
      }
    ]
  }
]
