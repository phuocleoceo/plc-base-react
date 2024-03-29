import { FieldError, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { InputValidation, SpinningCircle } from '~/common/components'
import { RegisterRequest } from '~/features/auth/models'
import { EmailValidation } from '~/shared/constants'
import { ValidationHelper } from '~/shared/helpers'
import { AuthAPI } from '~/features/auth/apis'

type FormData = Pick<
  RegisterRequest,
  'email' | 'password' | 'displayName' | 'identityNumber' | 'phoneNumber' | 'address'
>

export default function Register() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<FormData>()

  const isLoading = isSubmitting && !isSubmitSuccessful

  const registerMutation = useMutation({
    mutationFn: (body: RegisterRequest) => AuthAPI.register(body)
  })

  const handleRegister = handleSubmit((form: FormData) => {
    const registerData: RegisterRequest = {
      ...form,
      avatar: 'https://i.stack.imgur.com/SE2cv.jpg',
      addressWardId: 6351,
      roleId: 2
    }

    registerMutation.mutate(registerData, {
      onSuccess: () => {
        toast.success(t('register_success'))
        navigate('/auth/login')
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
    <div className='mb-12 w-11/12 max-w-[48rem]'>
      <div className={`h-[40vh] place-items-center ${isLoading ? 'grid' : 'hidden'}`}>
        <SpinningCircle height={50} width={50} />
      </div>
      <div className={`w-full rounded-md bg-white py-12 px-6 ${isLoading ? 'hidden' : 'block'}`}>
        <h2 className='text-center text-3xl font-medium text-gray-800 mb-5'>{t('join_now')}</h2>

        <form onSubmit={handleRegister}>
          <div className='grid grid-cols-2 gap-4'>
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

              <InputValidation
                label={t('display_name')}
                placeholder={t('enter_display_name...')}
                register={register('displayName', {
                  required: { value: true, message: t('display_name_required') }
                })}
                error={errors.displayName as FieldError}
                inputClass='border-gray-500'
              />
            </div>

            <div className='flex flex-col gap-y-4'>
              <InputValidation
                label={t('identity_number')}
                placeholder={t('enter_identity_number...')}
                register={register('identityNumber', {
                  required: { value: true, message: t('identity_number_required') }
                })}
                error={errors.identityNumber as FieldError}
                inputClass='border-gray-500'
              />

              <InputValidation
                label={t('phone_number')}
                placeholder={t('enter_phone_number...')}
                register={register('phoneNumber', {
                  required: { value: true, message: t('phone_number_required') }
                })}
                error={errors.phoneNumber as FieldError}
                inputClass='border-gray-500'
              />

              <InputValidation
                label={t('address')}
                placeholder={t('enter_address...')}
                register={register('address', {
                  required: { value: true, message: t('address_required') }
                })}
                error={errors.address as FieldError}
                inputClass='border-gray-500'
              />
            </div>
          </div>

          <hr className='mt-6 border-t-[.5px] border-gray-400' />
          <button type='submit' className='btn mt-4 w-full bg-[#321898] py-2'>
            {isSubmitting ? t('registering') : t('register')}
          </button>
        </form>

        <div className='flex items-center'>
          <hr className='grow border-t-[.5px] border-gray-400' />
          <span className='my-3 block w-fit bg-white px-2 text-center'>{t('or')}</span>
          <hr className='grow border-t-[.5px] border-gray-400' />
        </div>

        <div className='flex justify-center text-center'>
          <Link to='/auth/login' className='mr-2'>
            <span className='block text-blue-600 hover:underline'>{t('login')}</span>
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
