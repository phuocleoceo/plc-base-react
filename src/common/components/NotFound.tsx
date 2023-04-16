import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import NotFoundIMG from '~/assets/img/NotFound.png'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main className='flex h-screen w-full flex-col items-center justify-center'>
      <img width='35%' height='auto' src={NotFoundIMG} alt='notfound' />
      <h1 className='text-3xl font-extrabold tracking-widest text-gray-900'>{t('page_not_found')}</h1>
      <button className='mt-5'>
        <Link
          to='/'
          className='active:text-orange-500 group relative inline-block text-sm font-medium focus:outline-none focus:ring'
        >
          <span className='absolute inset-0 translate-x-0.5 translate-y-0.5 transition-transform group-hover:translate-y-0 group-hover:translate-x-0 bg-yellow-400' />
          <span className='relative block border border-current px-8 py-3 text-white'>
            <span>{t('go_back')}</span>
          </span>
        </Link>
      </button>
    </main>
  )
}
