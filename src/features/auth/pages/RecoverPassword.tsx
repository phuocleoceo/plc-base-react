import { useMutation } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useState } from 'react'

import { InputValidation, SpinningCircle } from '~/common/components'
import { RecoverPasswordRequest } from '~/features/auth/models'
import { ValidationHelper } from '~/shared/helpers'
import { useQueryParams } from '~/common/hooks'
import { AuthAPI } from '~/features/auth/apis'

import SmileIMG from '~/assets/img/smile.png'

type FormData = Pick<RecoverPasswordRequest, 'newPassword'>

export default function RecoverPassword() {
  const [isRecovered, setIsRecovered] = useState<boolean>(false)
  const queryParams = useQueryParams()
  const { t } = useTranslation()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<FormData>()

  const isLoading = isSubmitting && !isSubmitSuccessful

  const recoverPasswordMutation = useMutation({
    mutationFn: (body: RecoverPasswordRequest) => AuthAPI.recoverPassword(body)
  })

  const handleRecoverPassword = handleSubmit((form: FormData) => {
    const forgotPasswordData: RecoverPasswordRequest = {
      ...form,
      code: queryParams.code,
      userId: parseInt(queryParams.userId)
    }

    recoverPasswordMutation.mutate(forgotPasswordData, {
      onSuccess: () => setIsRecovered(true),
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
        {isRecovered ? (
          <>
            <div className='h-[45vh] place-items-center grid'>
              <h2 className='text-center text-3xl font-medium text-gray-800 mb-10'>{t('recover_password_success')}</h2>

              <img className='text-center' width='70%' height='auto' src={SmileIMG} alt='sendEmail' />

              <hr className='mt-4 border-t-[.5px] border-gray-400' />
              <Link className='btn mt-4 w-full bg-[#321898] py-2' to='/auth/login'>
                <span className='block text-center'>{t('login')}</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className='text-center text-3xl font-medium text-gray-800 mb-5'>{t('recover_password')}</h2>

            <form onSubmit={handleRecoverPassword}>
              <div className='flex flex-col gap-y-4'>
                <InputValidation
                  label={t('newPassword')}
                  register={register('newPassword', {
                    required: { value: true, message: t('newPassword_required') }
                  })}
                  error={errors.newPassword as FieldError}
                  inputClass='border-gray-500'
                  type='password'
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
              </div>

              <hr className='mt-6 border-t-[.5px] border-gray-400' />
              <button type='submit' className='btn mt-4 w-full bg-[#321898] py-2'>
                {isSubmitting ? t('updating_password') : t('update_password')}
              </button>
            </form>

            <div className='flex items-center'>
              <hr className='grow border-t-[.5px] border-gray-400' />
              <span className='my-3 block w-fit bg-white px-2 text-center'>{t('or')}</span>
              <hr className='grow border-t-[.5px] border-gray-400' />
            </div>

            <div className='flex justify-center'>
              <Link to='/auth/login' className='mr-2'>
                <span className='block text-center text-blue-600 hover:underline'>{t('login')}</span>
              </Link>
              <span className='text-blue-600'>/</span>
              <Link to='/auth/register' className='ml-2'>
                <span className='block text-center text-blue-600 hover:underline'>{t('register')}</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
