import { useRoutes } from 'react-router-dom'
import { NotFound } from '~/common/components'

const notFoundRoute = {
  path: '*',
  element: <NotFound />
}

const routes = [notFoundRoute]

export default function useRouteElements() {
  return useRoutes(routes)
}
