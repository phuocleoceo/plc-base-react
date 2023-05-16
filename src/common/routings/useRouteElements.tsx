import { RouteObject, useRoutes } from 'react-router-dom'

import { adminUserRoute } from '~/features/admin/user/routes'
import { projectRoute } from '~/features/project/routes'
import { authRoute } from '~/features/auth/routes'
import { defaultRoute } from './defaultRoute'

const routes: RouteObject[] = [...authRoute, ...projectRoute, ...adminUserRoute, ...defaultRoute]

export default function useRouteElements() {
  return useRoutes(routes)
}
