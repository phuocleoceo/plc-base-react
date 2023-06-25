import { RouteObject } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import { RequiredAuthenticatedRoute } from '~/common/routings/guardRoute'
import { AuthLayout } from '~/features/auth/layouts'

const PaymentCallback = lazy(() => import('~/features/profile/pages/PaymentCallback'))

export const profileRoute: RouteObject[] = [
  {
    path: 'payment',
    element: <RequiredAuthenticatedRoute />,
    children: [
      {
        path: 'callback',
        element: (
          <AuthLayout>
            <Suspense>
              <PaymentCallback />
            </Suspense>
          </AuthLayout>
        )
      }
    ]
  }
]
