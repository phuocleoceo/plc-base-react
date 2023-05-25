import { RouteObject } from 'react-router-dom'

import { ProjectMember } from '~/features/projectMember/pages'
import { ProjectLayout } from '~/features/project/layouts'

export const projectMemberRoute: RouteObject[] = [
  {
    path: ':projectId/member',
    element: (
      <ProjectLayout>
        <ProjectMember />
      </ProjectLayout>
    )
  }
]
