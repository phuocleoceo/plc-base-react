import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'

import { AppContext } from '~/common/contexts'

export const RequiredAuthenticatedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/auth/login' />
}
