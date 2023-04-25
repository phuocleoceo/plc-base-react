import { useTranslation } from 'react-i18next'

export default function Register() {
  const { t } = useTranslation()

  return <div>{t('access_denied')}</div>
}
