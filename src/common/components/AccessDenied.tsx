import { Link } from 'react-router-dom'

import AccessDeniedIMG from '~/assets/img/AccessDenied.png'

export default function AccessDenied() {
  return (
    <main className='flex h-screen w-full flex-col items-center justify-center'>
      <img width='40%' height='auto' src={AccessDeniedIMG} alt='notfound' />
      <h1 className='text-3xl font-extrabold tracking-widest text-gray-900'>Access Denied</h1>
      <button className='mt-5'>
        <Link
          to='/'
          className='active:text-orange-500 group relative inline-block text-sm font-medium focus:outline-none focus:ring'
        >
          <span className='absolute inset-0 translate-x-0.5 translate-y-0.5 transition-transform group-hover:translate-y-0 group-hover:translate-x-0 bg-orange-400' />
          <span className='relative block border border-current px-8 py-3 text-white'>
            <span>Go Back</span>
          </span>
        </Link>
      </button>
    </main>
  )
}
