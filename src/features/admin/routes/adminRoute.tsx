import { Navigate, RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { RequiredAuthenticatedRoute } from '~/common/routings/guardRoute'
import { AdminLayout } from '~/features/admin/layouts'

const UserAccountList = lazy(() => import('~/features/admin/features/user/pages/UserAccountList'))

export const adminRoute: RouteObject[] = [
  {
    path: 'admin',
    element: <RequiredAuthenticatedRoute />,
    children: [
      {
        path: '',
        element: <Navigate to='user' />
      },
      {
        path: 'user',
        element: (
          <AdminLayout>
            <Suspense>
              <UserAccountList />
            </Suspense>
          </AdminLayout>
        )
      },
      {
        path: 'setting',
        element: (
          <AdminLayout>
            <Suspense>
              <>Setting Work</>
            </Suspense>
          </AdminLayout>
        )
      }
    ]
  }
]
