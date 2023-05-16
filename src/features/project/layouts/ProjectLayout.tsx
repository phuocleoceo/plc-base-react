import { useTranslation } from 'react-i18next'

interface Props {
  children?: React.ReactNode
}
export default function ProjectLayout({ children }: Props) {
  const { t } = useTranslation()

  return <div>{children}</div>
}
