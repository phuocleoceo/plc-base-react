import { RouteObject, useRoutes } from 'react-router-dom'

import { userInvitationRoute } from '~/features/invitation/routes'
import { projectRoute } from '~/features/project/routes'
import { profileRoute } from '~/features/profile/routes'
import { adminRoute } from '~/features/admin/routes'
import { authRoute } from '~/features/auth/routes'
import { defaultRoute } from './defaultRoute'

const routes: RouteObject[] = [
  ...authRoute,
  ...profileRoute,
  ...projectRoute,
  ...userInvitationRoute,
  ...adminRoute,
  ...defaultRoute
]

export default function useRouteElements() {
  return useRoutes(routes)
}
