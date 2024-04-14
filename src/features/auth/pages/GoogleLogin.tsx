import {
  CodeResponse,
  TokenResponse,
  useGoogleLogin,
  CredentialResponse,
  useGoogleOneTapLogin
} from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'

export default function GoogleLogin() {
  const { t } = useTranslation()

  const onImplicitLoginSuccess = (response: TokenResponse) => {
    console.log(response)
  }

  const onImplicitLoginError = () => {
    console.log('Login Failed')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImplicitLogin = useGoogleLogin({
    onSuccess: onImplicitLoginSuccess,
    onError: onImplicitLoginError,
    flow: 'implicit'
  })

  const onAuthCodeLoginSuccess = (response: CodeResponse) => {
    console.log(response)
  }

  const onAuthCodeLoginError = () => {
    console.log('Login Failed')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAuthCodeLogin = useGoogleLogin({
    onSuccess: onAuthCodeLoginSuccess,
    onError: onAuthCodeLoginError,
    flow: 'auth-code'
  })

  const onOneTapSuccess = (response: CredentialResponse) => {
    console.log(response)
  }

  const onOneTapError = () => {
    console.log('Login Failed')
  }

  useGoogleOneTapLogin({
    onSuccess: onOneTapSuccess,
    onError: onOneTapError
  })

  return (
    <button
      onClick={() => handleAuthCodeLogin()}
      className='btn w-full flex justify-center items-center bg-white border border-gray-200 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      <Icon icon='logos:google-icon' className='mr-2' />
      {t('login_google')}
    </button>
  )
}
