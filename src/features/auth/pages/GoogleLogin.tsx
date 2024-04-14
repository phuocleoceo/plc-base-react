import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'

export default function Google() {
  const { t } = useTranslation()

  const onSuccess = (response: any) => {
    console.log(response)
  }

  const onError = () => {
    console.log('Login Failed')
  }

  useGoogleOneTapLogin({
    onSuccess,
    onError
  })

  const login = useGoogleLogin({
    onSuccess,
    onError
  })

  return (
    <button onClick={() => login()} className='btn w-full bg-[#dd4b39] py-2 flex justify-center items-center'>
      <Icon icon='logos:google-icon' className='text-white mr-2' />
      {t('login_google')}
    </button>
  )
}
