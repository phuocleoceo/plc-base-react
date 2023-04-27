import { FieldError, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { LocalStorageHelper, ValidationHelper } from '~/shared/helpers'
import { InputValidation, SpinningCircle } from '~/common/components'
import { LoginRequest } from '~/features/auth/models'
import { EmailValidation } from '~/shared/constants'
import { AuthAPI } from '~/features/auth/apis'
import { AppContext } from '~/common/contexts'

type FormData = Pick<LoginRequest, 'email' | 'password'>

export default function Login() {
  const { setIsAuthenticated } = useContext(AppContext)

  const navigate = useNavigate()
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
    loginMutation.mutate(form, {
      onSuccess: (data) => {
        setIsAuthenticated(true)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { accessToken, refreshToken, accessTokenExpiredAt, refreshTokenExpiredAt, ...userInfo } = data.data.data
        LocalStorageHelper.setAccessToken(accessToken)
        LocalStorageHelper.setRefreshToken(refreshToken)
        LocalStorageHelper.setUserInfo(userInfo)

        navigate('/')
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
        <SpinningCircle />
      </div>
      <div className={`w-full rounded-md bg-white py-12 px-6 ${isLoading ? 'hidden' : 'block'}`}>
        <h2 className='text-center text-3xl font-medium text-gray-800 mb-5'>{t('welcome_back')}</h2>

        <form onSubmit={handleLogin}>
          <div className='flex flex-col gap-y-4'>
            <InputValidation
              label={t('email')}
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
          </div>

          <InputValidation
            label={t('password')}
            register={register('password', {
              required: { value: true, message: t('password_required') }
            })}
            error={errors.password as FieldError}
            inputClass='border-gray-500'
            type='password'
          />

          <hr className='mt-6 border-t-[.5px] border-gray-400' />
          <button type='submit' className='btn mt-4 w-full bg-[#321898] py-2'>
            {isSubmitting ? t('logging_in') : t('login')}
          </button>
        </form>

        <div className='flex items-center'>
          <hr className='grow border-t-[.5px] border-gray-400' />
          <span className='my-3 block w-fit bg-white px-2 text-center'>{t('or')}</span>
          <hr className='grow border-t-[.5px] border-gray-400' />
        </div>
        <Link to='/auth/register'>
          <span className='block text-center text-blue-600 hover:underline'>{t('register')}</span>
        </Link>
      </div>
    </div>
  )
}
