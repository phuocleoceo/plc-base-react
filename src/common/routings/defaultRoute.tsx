import { RouteObject } from 'react-router-dom'

import { NotFound, AccessDenied } from '~/common/components'
import { Home } from '~/features/home/pages'

export const defaultRoute: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/access-denied',
    element: <AccessDenied />
  },
  {
    path: '*',
    element: <NotFound />
  }
]
