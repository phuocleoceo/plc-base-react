import { RouteObject } from 'react-router-dom'

import { NotFound, AccessDenied } from '~/common/components'

export const defaultRoute: RouteObject[] = [
  {
    path: '/access-denied',
    element: <AccessDenied />
  },
  {
    path: '*',
    element: <NotFound />
  }
]
