import { GoogleOAuthProvider } from '@react-oauth/google'
import { FieldError, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { LocalStorageHelper, ValidationHelper } from '~/shared/helpers'
import { InputValidation, SpinningCircle } from '~/common/components'
import { LoginRequest } from '~/features/auth/models'
import { EmailValidation } from '~/shared/constants'
import { AuthAPI } from '~/features/auth/apis'
import { AppContext } from '~/common/contexts'
import { LibraryConfig } from '~/configs'

import FacebookLogin from './FacebookLogin'
import GoogleLogin from './GoogleLogin'

type FormData = Pick<LoginRequest, 'email' | 'password'>

export default function Login() {
  const { setIsAuthenticated } = useContext(AppContext)

  const { t } = useTranslation()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<FormData>()

  const isLoading = isSubmitting && !isSubmitSuccessful

  const loginMutation = useMutation({
    mutationFn: (body: LoginRequest) => AuthAPI.login(body)
  })

  const handleLogin = handleSubmit((form: FormData) => {
    const loginData: LoginRequest = { ...form }

    loginMutation.mutate(loginData, {
      onSuccess: (data) => {
        setIsAuthenticated(true)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt, roleName, ...userInfo } =
          data.data.data
        LocalStorageHelper.setAccessToken(accessToken)
        LocalStorageHelper.setRefreshToken(refreshToken)
        LocalStorageHelper.setUserInfo(userInfo)
        LocalStorageHelper.setUserRole(roleName)

        // Use navigate('/') => bug not reload user
        window.location.href = '/'
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  return (
    <div className='mb-12 w-11/12 max-w-[24rem]'>
      <div className={`h-[40vh] place-items-center ${isLoading ? 'grid' : 'hidden'}`}>
        <SpinningCircle height={50} width={50} />
      </div>
      <div className={`w-full rounded-md bg-white py-12 px-6 ${isLoading ? 'hidden' : 'block'}`}>
        <h2 className='text-center text-3xl font-medium text-gray-800 mb-5'>{t('welcome_back')}</h2>

        <form onSubmit={handleLogin}>
          <div className='flex flex-col gap-y-4'>
            <InputValidation
              label={t('email')}
              placeholder={t('enter_email...')}
              register={register('email', {
                required: { value: true, message: t('email_required') },
                pattern: {
                  value: EmailValidation,
                  message: t('email_invalid')
                }
              })}
              error={errors.email as FieldError}
              inputClass='border-gray-500'
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />

            <InputValidation
              label={t('password')}
              placeholder={t('enter_password...')}
              register={register('password', {
                required: { value: true, message: t('password_required') }
              })}
              error={errors.password as FieldError}
              inputClass='border-gray-500'
              type='password'
            />
          </div>

          <hr className='mt-6 border-t-[.5px] border-gray-400' />
          <button type='submit' className='btn mt-4 w-full bg-[#321898] py-2'>
            {isSubmitting ? t('logging_in') : t('login')}
          </button>
        </form>

        <div className='mt-2 w-full'>
          <FacebookLogin />
        </div>

        <div className='mt-2 w-full'>
          <GoogleOAuthProvider clientId={LibraryConfig.GoogleClientId}>
            <GoogleLogin />
          </GoogleOAuthProvider>
        </div>

        <div className='flex items-center'>
          <hr className='grow border-t-[.5px] border-gray-400' />
          <span className='my-3 block w-fit bg-white px-2 text-center'>{t('or')}</span>
          <hr className='grow border-t-[.5px] border-gray-400' />
        </div>

        <div className='flex justify-center text-center'>
          <Link to='/auth/register' className='mr-2'>
            <span className='block text-blue-600 hover:underline'>{t('register')}</span>
          </Link>
          <span className='text-black'>/</span>
          <Link to='/auth/forgot-password' className='ml-2'>
            <span className='block text-blue-600 hover:underline'>{t('forgot_passord')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
