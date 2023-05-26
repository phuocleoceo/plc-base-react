import { useQuery } from '@tanstack/react-query'

import { ProfileApi } from '~/features/profile/apis'
import { Modal } from '~/common/components'

interface Props {
  userId: number
  isShowing: boolean
  onClose: () => void
}

export default function ProjectMemberDetail(props: Props) {
  const { userId, isShowing, onClose } = props

  const { data, isLoading } = useQuery({
    queryKey: ['anonymousProfile', userId],
    queryFn: () => ProfileApi.getAnonymousProfile(userId),
    staleTime: 1000
  })

  const user = data?.data.data

  return (
    <Modal isLoading={isLoading} {...{ isShowing, onClose }}>
      <>{user?.email}</>
    </Modal>
  )
}
