import { RouteObject, useRoutes } from 'react-router-dom'

import { userInvitationRoute } from '~/features/invitation/routes'
import { projectStatusRoute } from '~/features/projectStatus/routes'
import { adminUserRoute } from '~/features/admin/user/routes'
import { projectRoute } from '~/features/project/routes'
import { profileRoute } from '~/features/profile/routes'
import { sprintRoute } from '~/features/sprint/routes'
import { issueRoute } from '~/features/issue/routes'
import { authRoute } from '~/features/auth/routes'
import { defaultRoute } from './defaultRoute'

const routes: RouteObject[] = [
  ...authRoute,
  ...profileRoute,
  ...projectRoute,
  ...userInvitationRoute,
  ...issueRoute,
  ...projectStatusRoute,
  ...sprintRoute,
  ...adminUserRoute,
  ...defaultRoute
]

export default function useRouteElements() {
  return useRoutes(routes)
}
