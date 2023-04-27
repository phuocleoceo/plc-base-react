import { FieldError, FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { InputValidation, SpinningCircle } from '~/common/components'
import { EmailValidation } from '~/shared/constants'

export default function Login() {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  const isLoading = isSubmitting && !isSubmitSuccessful

  const handleLogin = handleSubmit(async (form: FieldValues) => {
    console.log(form)
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
