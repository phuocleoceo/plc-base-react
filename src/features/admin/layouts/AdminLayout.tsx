import { AdminMenubar } from '~/features/admin/components'
import { Sidebar } from '~/features/home/components'

interface Props {
  children?: React.ReactNode
}
export default function AdminLayout({ children }: Props) {
  return (
    <>
      <Sidebar />
      <AdminMenubar />
      <main className='z-10 h-screen grow overflow-auto bg-c-1 bg-center'>{children}</main>
    </>
  )
}
