import { RouteObject, useRoutes } from 'react-router-dom'

import { projectMemberRoute } from '~/features/projectMember/routes'
import { invitationRoute } from '~/features/invitation/routes'
import { adminUserRoute } from '~/features/admin/user/routes'
import { projectRoute } from '~/features/project/routes'
import { issueRoute } from '~/features/issue/routes'
import { authRoute } from '~/features/auth/routes'
import { defaultRoute } from './defaultRoute'

const routes: RouteObject[] = [
  ...authRoute,
  ...projectRoute,
  ...invitationRoute,
  ...issueRoute,
  ...projectMemberRoute,
  ...adminUserRoute,
  ...defaultRoute
]

export default function useRouteElements() {
  return useRoutes(routes)
}
