import { UserProfileType, ProfileTab } from '~/features/profile/models'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  user?: UserProfileType
  onChangeTab: (newTab: ProfileTab) => void
}

export default function UpdateProfile(props: Props) {
  const { user, onChangeTab } = props

  const queryClient = useQueryClient()

  return (
    <>
      <div className='mb-2 text-center'>
        <div className='mt-3'>
          <button className='btn w-40'>update_profile</button>
        </div>

        <div className='mt-3'>
          <button onClick={() => onChangeTab(ProfileTab.ProfileDetail)} className='btn w-40'>
            go_back
          </button>
        </div>
      </div>
    </>
  )
}
