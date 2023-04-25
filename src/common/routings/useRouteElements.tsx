import { RouteObject, useRoutes } from 'react-router-dom'

import { authRoute } from '~/features/auth/routes'
import { defaultRoute } from './defaultRoute'

const routes: RouteObject[] = [...authRoute, ...defaultRoute]

export default function useRouteElements() {
  return useRoutes(routes)
}
