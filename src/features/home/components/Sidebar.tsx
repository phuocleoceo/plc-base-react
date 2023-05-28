import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Suspense, lazy, useContext } from 'react'
import { motion } from 'framer-motion'

import { LocalStorageHelper } from '~/shared/helpers'
import { Avatar, IconBtn } from '~/common/components'
import { ProfileApi } from '~/features/profile/apis'
import { AppContext } from '~/common/contexts'
import { useShowing } from '~/common/hooks'

import JiraWhiteIcon from '~/assets/svg/jira-white.svg'

const Profile = lazy(() => import('~/features/profile/pages/Profile'))

export default function Sidebar() {
  const { isShowing, toggle } = useShowing()
  const navigate = useNavigate()

  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext)

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => ProfileApi.getPersonalProfile(),
    enabled: isAuthenticated
  })

  const user = data?.data.data

  const handleGetInvitation = () => {
    navigate('/user/invitation')
  }

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
                onClick={toggle}
                className='h-9 w-9 border-[1px] hover:border-green-500'
              />
              <IconBtn onClick={handleGetInvitation} icon='iconoir:telegram' title='invitations' />
              <IconBtn onClick={handleLogOut} icon='charm:sign-out' title='log_out' />
            </>
          )}
        </div>
      </div>
      <motion.div initial={{ width: 0 }} animate={{ width: isShowing ? 320 : 0 }} transition={{ type: 'tween' }}>
        <Suspense>
          <Profile user={user} />
        </Suspense>
      </motion.div>
      <div className='absolute top-0 right-0 h-full w-[2px] bg-c-3 peer-hover:bg-secondary' />
    </div>
  )
}
