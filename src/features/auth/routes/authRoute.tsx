import { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { AuthLayout } from '~/features/auth/layouts'

const Login = lazy(() => import('~/features/auth/pages/Login'))
const Register = lazy(() => import('~/features/auth/pages/Register'))
const ConfirmEmail = lazy(() => import('~/features/auth/pages/ConfirmEmail'))
const ForgotPassword = lazy(() => import('~/features/auth/pages/ForgotPassword'))
const RecoverPassword = lazy(() => import('~/features/auth/pages/RecoverPassword'))

export const authRoute: RouteObject[] = [
  {
    path: '/auth/login',
    element: (
      <AuthLayout>
        <Suspense>
          <Login />
        </Suspense>
      </AuthLayout>
    )
  },
  {
    path: '/auth/register',
    element: (
      <AuthLayout>
        <Suspense>
          <Register />
        </Suspense>
      </AuthLayout>
    )
  },
  {
    path: '/auth/confirm-email',
    element: (
      <AuthLayout>
        <Suspense>
          <ConfirmEmail />
        </Suspense>
      </AuthLayout>
    )
  },
  {
    path: '/auth/forgot-password',
    element: (
      <AuthLayout>
        <Suspense>
          <ForgotPassword />
        </Suspense>
      </AuthLayout>
    )
  },
  {
    path: '/auth/recover-password',
    element: (
      <AuthLayout>
        <Suspense>
          <RecoverPassword />
        </Suspense>
      </AuthLayout>
    )
  }
]
