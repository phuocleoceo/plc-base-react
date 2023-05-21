import { Navigate, Outlet, useOutlet } from 'react-router-dom'
import { useContext } from 'react'

import { Sidebar, Menubar, Breadcrumbs } from '~/features/home/components'
import { ProjectList } from '~/features/project/pages'
import { AppContext } from '~/common/contexts'

export default function Home() {
  const outlet = useOutlet()
  const { isAuthenticated } = useContext(AppContext)

  if (!isAuthenticated) return <Navigate to='/auth/login' />

  return (
    <>
      <Sidebar />
      <Menubar />
      {outlet ? (
        <>
          <main className='z-10 h-screen grow overflow-auto bg-c-1 bg-center'>
            <Breadcrumbs />
            <Outlet />
          </main>
        </>
      ) : (
        <ProjectList />
      )}
    </>
  )
}
