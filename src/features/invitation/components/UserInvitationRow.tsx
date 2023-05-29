import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'

import { InvitationApi } from '~/features/invitation/apis'
import { Avatar } from '~/common/components'

interface Props {
  idx: number
  invitationId: number
  senderId: number
  senderName: string
  senderEmail: string
  senderAvatar: string
  projectId: number
  projectName: string
  projectImage: string
  acceptedAt: Date
  declinedAt: Date
  onClick?: () => void
}

export default function ProjectInvitationRow(props: Props) {
  const {
    idx,
    invitationId,
    senderName,
    senderEmail,
    senderAvatar,
    projectName,
    projectImage,
    acceptedAt,
    declinedAt,
    onClick
  } = props

  const queryClient = useQueryClient()

  const acceptInvitationMutation = useMutation({
    mutationFn: () => InvitationApi.acceptInvitation(invitationId)
  })

  const declineInvitationMutation = useMutation({
    mutationFn: () => InvitationApi.declineInvitation(invitationId)
  })

  const handleAcceptInvitation = async (event: React.MouseEvent) => {
    event.stopPropagation()
    acceptInvitationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('accept_invitation_success')
        queryClient.invalidateQueries(['userInvitations'])
      }
    })
  }

  const handleDeclineInvitation = (event: React.MouseEvent) => {
    event.stopPropagation()
    declineInvitationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('decline_invitation_success')
        queryClient.invalidateQueries(['userInvitations'])
      }
    })
  }

  return (
    <>
      <div
        key={invitationId}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
        onClick={onClick}
        onKeyDown={onClick}
        tabIndex={invitationId}
        role='button'
      >
        <div className='w-32 text-center'>{idx + 1}</div>
        <div className='w-60 flex'>
          <Avatar
            title={senderName}
            src={senderAvatar}
            name={senderName}
            className='h-9 w-9 border-[1px] hover:border-green-500'
          />
          <span className='ml-3'>{senderName}</span>
        </div>
        <div className='w-72'>{senderEmail}</div>
        <div className='w-72 flex'>
          <Avatar
            title={projectName}
            src={projectImage}
            name={projectName}
            className='h-9 w-9 border-[1px] hover:border-green-500'
          />
          <span className='ml-3'>{projectName}</span>
        </div>

        <div className='flex-grow flex'>
          {acceptedAt && <span>accept</span>}
          {declinedAt && <span>declined</span>}

          {!declinedAt && !acceptedAt && (
            <div className='flex'>
              <button title='accept_invitation' onClick={handleAcceptInvitation} className='btn-icon bg-c-1'>
                <Icon width={22} icon='mdi:check-outline' className='text-green-500' />
              </button>

              <button title='decline_invitation' onClick={handleDeclineInvitation} className='btn-icon bg-c-1'>
                <Icon width={22} icon='mdi:close-outline' className='text-red-500' />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
