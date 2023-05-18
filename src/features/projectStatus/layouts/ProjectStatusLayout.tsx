import { useTranslation } from 'react-i18next'

interface Props {
  children?: React.ReactNode
}
export default function ProjectStatusLayout({ children }: Props) {
  const { t } = useTranslation()

  return <div>{children}</div>
}
