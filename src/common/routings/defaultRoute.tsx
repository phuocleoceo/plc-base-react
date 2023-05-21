import { RouteObject } from 'react-router-dom'

import { NotFound, AccessDenied } from '~/common/components'
import { Home } from '~/features/home/pages'
import { RequiredAuthenticatedRoute } from './guardRoute'

export const defaultRoute: RouteObject[] = [
  {
    path: '/',
    element: <RequiredAuthenticatedRoute />,
    children: [
      {
        path: '',
        element: <Home />
      }
    ]
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
