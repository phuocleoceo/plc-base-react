import { UserProfileType } from '~/features/profile/models'
import { Avatar } from '~/common/components'
import { ProfileTab } from '~/shared/enums'

interface Props {
  user?: UserProfileType
  onChangeTab: (newTab: ProfileTab) => void
}

export default function ProfileDetail(props: Props) {
  const { user, onChangeTab } = props

  const getFullAddress = () => {
    return `${user?.address}, ${user?.addressWard}, ${user?.addressDistrict}, ${user?.addressProvince}`
  }

  return (
    <>
      <div className='flex justify-center'>
        <Avatar src={user?.avatar} name={user?.displayName} className='h-40 w-40 cursor-default text-6xl' />
      </div>

      <div className='ml-10'>
        <div className='mb-4'>
          <span className='text-gray-600 font-bold'>email:</span>
          <div className='text-black'>{user?.email}</div>
        </div>

        <div className='mb-4'>
          <span className='text-gray-600 font-bold'>display_name:</span>
          <div className='text-black'>{user?.displayName}</div>
        </div>

        <div className='mb-4'>
          <span className='text-gray-600 font-bold'>phone_number:</span>
          <div className='text-black'>{user?.phoneNumber}</div>
        </div>

        <div className='mb-4'>
          <span className='text-gray-600 font-bold'>identity_number:</span>
          <div className='text-black'>{user?.identityNumber}</div>
        </div>

        <div className='mb-2'>
          <span className='text-gray-600 font-bold'>address:</span>
          <div className='text-black'>{getFullAddress()}</div>
        </div>
      </div>

      <div className='text-center'>
        <div className='mb-3'>
          <button onClick={() => onChangeTab(ProfileTab.UpdateProfile)} className='btn w-40'>
            update_profile
          </button>
        </div>

        <div className='mb-3'>
          <button onClick={() => onChangeTab(ProfileTab.ChangePassword)} className='btn w-40'>
            change_password
          </button>
        </div>
      </div>
    </>
  )
}
