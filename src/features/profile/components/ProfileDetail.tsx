import { UserProfileType, ProfileTab } from '~/features/profile/models'
import { Avatar } from '~/common/components'

interface Props {
  user?: UserProfileType
  onChangeTab: (newTab: ProfileTab) => void
}

export default function ProfileDetail(props: Props) {
  const { user, onChangeTab } = props

  return (
    <>
      <Avatar src={user?.avatar} name={user?.displayName} className='h-40 w-40 cursor-default text-6xl' />

      <div className='mb-2 text-center'>
        <div className='mt-3'>
          <button onClick={() => onChangeTab(ProfileTab.UpdateProfile)} className='btn'>
            update_profile
          </button>
        </div>

        <div className='mt-3'>
          <button onClick={() => onChangeTab(ProfileTab.ChangePassword)} className='btn'>
            change_password
          </button>
        </div>
      </div>
    </>
  )
}
