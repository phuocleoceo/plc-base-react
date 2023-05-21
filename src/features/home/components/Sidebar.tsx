import { Suspense, useContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { LocalStorageHelper } from '~/shared/helpers'
import { Avatar, IconBtn } from '~/common/components'
import { ProfileApi } from '~/features/profile/apis'
import { AppContext } from '~/common/contexts'

import JiraWhiteIcon from '~/assets/svg/jira-white.svg'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext)

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => ProfileApi.getPersonalProfile(),
    enabled: isAuthenticated
  })

  const user = data?.data.data

  const handleLogOut = () => {
    LocalStorageHelper.clear()
    setIsAuthenticated(false)
    navigate('/auth/login')
  }

  return (
    <div className='flex min-h-screen shrink-0'>
      <div className='flex w-14 flex-col items-center justify-between bg-primary py-6'>
        <div className='flex flex-col gap-y-8'>
          <button title='Go to Home' onClick={() => navigate('/')} className='w-8'>
            <img className='h-8 w-12' src={JiraWhiteIcon} alt='jira-clone' />
          </button>
        </div>
        <div className='flex flex-col gap-6'>
          {user && (
            <>
              <Avatar
                title='Profile'
                src={user.avatar}
                name={user.displayName}
                onClick={() => setIsOpen((p) => !p)}
                className='h-9 w-9 border-[1px] hover:border-green-500'
              />
              <IconBtn onClick={handleLogOut} icon='charm:sign-out' title='Log Out' />
            </>
          )}
        </div>
      </div>
      <motion.div initial={{ width: 0 }} animate={{ width: isOpen ? 320 : 0 }} transition={{ type: 'tween' }}>
        <Suspense>{/* <Profile authUser={u} /> */}</Suspense>
      </motion.div>
    </div>
  )
}
