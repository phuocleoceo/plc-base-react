import { RouteObject, useRoutes } from 'react-router-dom'

import { projectRoute } from '~/features/project/routes'
import { authRoute } from '~/features/auth/routes'
import { defaultRoute } from './defaultRoute'

const routes: RouteObject[] = [...authRoute, ...projectRoute, ...defaultRoute]

export default function useRouteElements() {
  return useRoutes(routes)
}
