import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

import { Avatar, IconLink } from '~/common/components'
import { useToggle } from '~/common/hooks'

import ScrumIMG from '~/assets/img/scrum.jpg'

export default function AdminMenubar() {
  // host/admin/currentTab
  const currentTab = useLocation().pathname.split('/')[2]

  const { isShowing, toggle } = useToggle(true)

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isShowing ? 240 : 15 }}
      transition={{ type: 'tween' }}
      className='relative bg-c-2'
    >
      <div className='h-full w-[15rem] bg-c-2 px-4 py-6'>
        <div className='flex'>
          <div className='grid h-10 w-10 shrink-0 place-items-center text-lg'>
            <Avatar title='JiPLC' src={ScrumIMG} name='JiPLC' className='h-9 w-9 border-[1px] hover:border-green-500' />
          </div>

          <div className='ml-2 w-40'>
            <span className='block truncate text-sm font-medium text-c-5'>Scrum with JiPLC</span>
            <span className='text-[13px] text-c-text'>welcome_admin</span>
          </div>
        </div>

        <div className='mt-5 mb-2'>
          <IconLink to='/admin/user' icon='mdi:account' text='user' isActive={currentTab === 'user'} />
        </div>

        <hr className='border-t-[.5px] border-gray-400' />

        <div className='mt-2 mb-2'>
          <IconLink
            to='/admin/setting'
            icon='clarity:settings-solid'
            text='setting'
            isActive={currentTab === 'setting'}
          />
        </div>
      </div>

      <button
        title='toggle_project_menubar'
        onClick={toggle}
        className={`border-zinc-text00 group peer absolute -right-[14px] top-8 z-[20] grid h-7 w-7 place-items-center rounded-full border-[1px] bg-c-1 hover:border-secondary hover:bg-secondary`}
      >
        <Icon
          className='text-secondary group-hover:text-white'
          icon={isShowing ? 'fa-solid:angle-left' : 'fa-solid:angle-right'}
        />
      </button>
      <div className='absolute top-0 right-0 h-full w-[2px] bg-c-3 peer-hover:bg-secondary' />
    </motion.div>
  )
}
