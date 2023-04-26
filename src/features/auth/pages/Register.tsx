import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { SpinningCircle } from '~/common/components'
import { AuthForm } from '../components'

export default function Login() {
  const { t } = useTranslation()

  const {
    register,
    formState: { errors, isSubmitting: loading, isSubmitSuccessful: success },
    handleSubmit
  } = useForm()
  const isLoading = loading && !success

  const logIn = async (body: FieldValues) => {
    console.log(body)
  }

  return (
    <div className='mb-12 w-11/12 max-w-[24rem]'>
      <div className={`h-[40vh] place-items-center ${isLoading ? 'grid' : 'hidden'}`}>
        <SpinningCircle />
      </div>
      <div className={`w-full rounded-md bg-white py-12 px-6 ${isLoading ? 'hidden' : 'block'}`}>
        <h2 className='text-center text-3xl font-medium text-gray-800 mb-5'>{t('welcome_back')}</h2>

        <AuthForm type='LOGIN' onSubmit={logIn} {...{ errors, handleSubmit, register, loading }} />

        <div className='flex items-center'>
          <hr className='grow border-t-[.5px] border-gray-400' />
          <span className='my-3 block w-fit bg-white px-2 text-center'>{t('or')}</span>
          <hr className='grow border-t-[.5px] border-gray-400' />
        </div>
        <Link to='/auth/login'>
          <span className='block text-center text-blue-600 hover:underline'>{t('login')}</span>
        </Link>
      </div>
    </div>
  )
}
