import { Outlet, useOutlet } from 'react-router-dom'

import { Sidebar } from '~/features/home/components'
import { ProjectList } from '~/features/project/pages'

export default function Home() {
  const outlet = useOutlet()

  return (
    <>
      <Sidebar />
      {outlet ? (
        <main className='z-10 h-screen grow overflow-auto bg-c-1 bg-center'>
          <Outlet />
        </main>
      ) : (
        <ProjectList />
      )}
    </>
  )
}
