import { RouteObject } from 'react-router-dom'

import { RequiredAuthenticatedRoute } from '~/common/routings'
import { ProjectList } from '~/features/project/pages'
import { HomeLayout } from '~/features/home/layouts'

export const projectRoute: RouteObject[] = [
  {
    path: '/',
    element: (
      <HomeLayout>
        <ProjectList />
      </HomeLayout>
    )
  }
]
