import FacebookLogin from '@greatsumini/react-facebook-login'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'

import { LibraryConfig } from '~/configs'

export default function Facebook() {
  const { t } = useTranslation()

  const onSuccess = (response: any) => {
    console.log(response)
  }

  const onFail = (error: any) => {
    console.log(error)
  }

  return (
    <FacebookLogin
      appId={LibraryConfig.FacebookClientId}
      onSuccess={onSuccess}
      onFail={onFail}
      render={({ onClick }) => (
        <button
          onClick={onClick}
          className='btn w-full flex justify-center items-center bg-blue-600 border border-gray-200 rounded-md px-4 py-2 text-sm font-medium text-white hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <Icon icon='logos:facebook' className='mr-2' />
          {t('login_facebook')}
        </button>
      )}
    />
  )
}
