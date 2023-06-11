import { UserAccount } from '~/features/admin/features/user/models'
import { Avatar } from '~/common/components'
import { useToggle } from '~/common/hooks'

interface Props {
  idx: number
  user: UserAccount
}

export default function UserRow(props: Props) {
  const { idx, user } = props

  const { isShowing: isShowingUpdateUser, toggle: toggleUpdateUser } = useToggle()

  const getFullAddress = () => {
    return `${user?.address}, ${user?.addressWard}, ${user?.addressDistrict}, ${user?.addressProvince}`
  }

  return (
    <>
      <div
        key={user.id}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
        onClick={toggleUpdateUser}
        onKeyDown={toggleUpdateUser}
        tabIndex={user.id}
        role='button'
      >
        <div className='w-16 text-center'>{idx + 1}</div>

        <div className='w-56'>{user.email}</div>

        <div className='w-56 flex'>
          <Avatar
            title={user.displayName}
            src={user.avatar}
            name={user.displayName}
            className='h-9 w-9 border-[1px] hover:border-green-500'
          />
          <span className='ml-3'>{user.displayName}</span>
        </div>

        <div className='w-32'>{user.phoneNumber}</div>

        <div className='w-32'>{user.identityNumber}</div>

        <div className='flex-grow'>{getFullAddress()}</div>
      </div>

      {isShowingUpdateUser ?? <></>}
    </>
  )
}
