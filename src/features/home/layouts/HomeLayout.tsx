import { Sidebar } from '~/features/home/components'

interface Props {
  children?: React.ReactNode
}
export default function HomeLayout({ children }: Props) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  )
}
