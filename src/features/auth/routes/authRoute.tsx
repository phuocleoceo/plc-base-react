import { RouteObject } from 'react-router-dom'

import { Login, Register } from '../pages'
import { AuthLayout } from '../layouts'

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
