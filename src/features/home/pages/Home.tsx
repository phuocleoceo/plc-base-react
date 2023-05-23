import { Outlet, useOutlet } from 'react-router-dom'

import { Sidebar, Menubar, Breadcrumbs } from '~/features/home/components'
import { ProjectList } from '~/features/project/pages'

export default function Home() {
  const outlet = useOutlet()

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
