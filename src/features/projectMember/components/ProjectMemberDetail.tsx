import { useQuery } from '@tanstack/react-query'

import { ProfileApi } from '~/features/profile/apis'
import { Avatar, Modal } from '~/common/components'
import { QueryKey } from '~/shared/constants'

interface Props {
  userId: number
  isShowing: boolean
  onClose: () => void
}

export default function ProjectMemberDetail(props: Props) {
  const { userId, isShowing, onClose } = props

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.AnonymousProfile, userId],
    queryFn: () => ProfileApi.getAnonymousProfile(userId),
    staleTime: 1000
  })

  const user = data?.data.data

  const getFullAddress = () => {
    return `${user?.address}, ${user?.addressWard}, ${user?.addressDistrict}, ${user?.addressProvince}`
  }

  return (
    <Modal isLoading={isLoading} {...{ isShowing, onClose }}>
      <>
        <div className='mb-5'>
          <span className='text-[22px] font-[600] text-c-text'>{user?.displayName}</span>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-4'>
            <div className='mt-10 flex justify-center'>
              <Avatar src={user?.avatar} name={user?.displayName} className='h-40 w-40 cursor-default text-6xl' />
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='mb-1'>
              <span className='text-gray-600 font-bold'>email:</span>
              <div className='text-black'>{user?.email}</div>
            </div>

            <div className='mb-1'>
              <span className='text-gray-600 font-bold'>phone_number:</span>
              <div className='text-black'>{user?.phoneNumber}</div>
            </div>

            <div className='mb-1'>
              <span className='text-gray-600 font-bold'>address:</span>
              <div className='text-black'>{getFullAddress()}</div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  )
}
