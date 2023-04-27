import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { SpinningCircle } from '~/common/components'

export default function Login() {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading, isSubmitSuccessful: success }
  } = useForm()

  const isLoading = loading && !success

  return (
    <div className='mb-12 w-11/12 max-w-[24rem]'>
      <div className={`h-[40vh] place-items-center ${isLoading ? 'grid' : 'hidden'}`}>
        <SpinningCircle />
      </div>
      <div className={`w-full rounded-md bg-white py-12 px-6 ${isLoading ? 'hidden' : 'block'}`}>
        <h2 className='text-center text-3xl font-medium text-gray-800 mb-5'>{t('welcome_back')}</h2>

        <Link to='/auth/login'>
          <span className='block text-center text-blue-600 hover:underline'>{t('login')}</span>
        </Link>
      </div>
    </div>
  )
}
