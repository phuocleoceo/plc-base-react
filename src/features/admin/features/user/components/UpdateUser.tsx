import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'

import { UpdateUserAccountRequest } from '~/features/admin/features/user/models'
import { UserAccountApi } from '~/features/admin/features/user/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { Modal } from '~/common/components'

interface Props {
  userId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<UpdateUserAccountRequest, 'roleId' | 'isActived'>

export default function IssueDetail(props: Props) {
  const { userId, isShowing, onClose } = props

  const { isAuthenticated } = useContext(AppContext)

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: [QueryKey.UserAccountDetail, userId],
    queryFn: () => UserAccountApi.getUserAccountDetail(userId),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const user = userData?.data.data

  return (
    <>
      <Modal isLoading={isLoadingUser} {...{ isShowing, onClose }} className='max-w-[65rem]'>
        <>{user?.email}</>
      </Modal>
    </>
  )
}
