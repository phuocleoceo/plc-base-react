import { Navigate, RouteObject } from 'react-router-dom'

import { NotFound, AccessDenied } from '~/common/components'
import { RequiredAuthenticatedRoute } from './guardRoute'

export const defaultRoute: RouteObject[] = [
  {
    path: '/',
    element: <RequiredAuthenticatedRoute />,
    children: [
      {
        path: '',
        element: <Navigate to='/project' />
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
