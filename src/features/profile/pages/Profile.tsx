import { lazy, Suspense, useState } from 'react'

import { UserProfileType } from '~/features/profile/models'
import { ProfileTab } from '~/shared/enums'

const ProfileDetail = lazy(() => import('~/features/profile/components/ProfileDetail'))
const UpdateProfile = lazy(() => import('~/features/profile/components/UpdateProfile'))
const ChangePassword = lazy(() => import('~/features/profile/components/ChangePassword'))

interface Props {
  user?: UserProfileType
}

export default function Profile(props: Props) {
  const { user } = props

  const [tab, setTab] = useState<number>(ProfileTab.ProfileDetail)

  const handleChangeTab = (newTab: ProfileTab) => setTab(newTab)

  return (
    <div className='flex h-screen w-[320px] flex-col gap-8 overflow-y-auto overflow-x-hidden border-r-2 border-c-3 bg-c-1 p-6'>
      {user && (
        <>
          {tab === ProfileTab.ProfileDetail && (
            <Suspense>
              <ProfileDetail user={user} onChangeTab={handleChangeTab} />
            </Suspense>
          )}

          {tab === ProfileTab.UpdateProfile && (
            <Suspense>
              <UpdateProfile user={user} onChangeTab={handleChangeTab} />
            </Suspense>
          )}

          {tab === ProfileTab.ChangePassword && (
            <Suspense>
              <ChangePassword onChangeTab={handleChangeTab} />
            </Suspense>
          )}
        </>
      )}
    </div>
  )
}
