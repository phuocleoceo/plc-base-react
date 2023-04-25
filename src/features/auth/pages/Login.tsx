import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t } = useTranslation()

  return <div>{t('go_back')}</div>
}
