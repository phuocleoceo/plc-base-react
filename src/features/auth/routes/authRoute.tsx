import { RouteObject } from 'react-router-dom'

import { AuthLayout } from '~/common/layouts'
import { Login, Register } from '../pages'

export const authRoute: RouteObject[] = [
  {
    path: '/auth/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    )
  },
  {
    path: '/auth/register',
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    )
  }
]
