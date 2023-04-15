import { RouteObject, useRoutes } from 'react-router-dom'

import { defaultRoute } from './defaultRoute'

const routes: RouteObject[] = [...defaultRoute]

export default function useRouteElements() {
  return useRoutes(routes)
}
