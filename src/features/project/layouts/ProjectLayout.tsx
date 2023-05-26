import { Sidebar } from '~/features/home/components'
import { Menubar, Breadcrumbs } from '~/features/project/components'

interface Props {
  children?: React.ReactNode
}
export default function ProjectLayout({ children }: Props) {
  return (
    <>
      <Sidebar />
      <Menubar />
      <main className='z-10 h-screen grow overflow-auto bg-c-1 bg-center'>
        <Breadcrumbs />
        {children}
      </main>
    </>
  )
}
