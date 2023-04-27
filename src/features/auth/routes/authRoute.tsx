import { RouteObject } from 'react-router-dom'

import { ConfirmEmail, ForgotPassword, Login, Register } from '~/features/auth/pages'
import { AuthLayout } from '~/features/auth/layouts'

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
  },
  {
    path: '/auth/confirm-email',
    element: (
      <AuthLayout>
        <ConfirmEmail />
      </AuthLayout>
    )
  },
  {
    path: '/auth/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    )
  }
]
