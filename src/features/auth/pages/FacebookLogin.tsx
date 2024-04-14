import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'

export default function FacebookLogin() {
  const { t } = useTranslation()

  const onSuccess = (response: any) => {
    console.log(response)
  }

  const onError = () => {
    console.log('Login Failed')
  }

  return (
    <button className='btn mt-2 w-full bg-[#3b5998] py-2 flex justify-center items-center'>
      <Icon icon='logos:facebook' className='text-white mr-2' />
      {t('login_facebook')}
    </button>
  )
}
