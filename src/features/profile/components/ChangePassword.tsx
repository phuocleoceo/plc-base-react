import { ProfileTab } from '~/features/profile/models'

interface Props {
  onChangeTab: (newTab: ProfileTab) => void
}

export default function ChangePassword(props: Props) {
  const { onChangeTab } = props

  return (
    <>
      <div className='mb-2 text-center'>
        <div className='mt-3'>
          <button className='btn w-40'>change_password</button>
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
