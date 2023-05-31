import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Suspense, lazy } from 'react'
import { Icon } from '@iconify/react'

import { UserInvitation } from '~/features/invitation/models'
import { InvitationApi } from '~/features/invitation/apis'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { useShowing } from '~/common/hooks'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  idx: number
  invitation: UserInvitation
  onClick?: () => void
}

export default function ProjectInvitationRow(props: Props) {
  const { idx, invitation, onClick } = props

  const { isShowing: isShowingAcceptInvitation, toggle: toggleAcceptInvitation } = useShowing()
  const { isShowing: isShowingDeclineInvitation, toggle: toggleDeclineInvitation } = useShowing()

  const queryClient = useQueryClient()

  const acceptInvitationMutation = useMutation({
    mutationFn: () => InvitationApi.acceptInvitation(invitation.invitationId)
  })

  const handleClickAcceptInvitation = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleAcceptInvitation()
  }

  const handleAcceptInvitation = async () => {
    acceptInvitationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('accept_invitation_success')
        queryClient.invalidateQueries([QueryKey.UserInvitations])
      }
    })
  }

  const handleClickDeclineInvitation = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleDeclineInvitation()
  }

  const declineInvitationMutation = useMutation({
    mutationFn: () => InvitationApi.declineInvitation(invitation.invitationId)
  })

  const handleDeclineInvitation = async () => {
    declineInvitationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('decline_invitation_success')
        queryClient.invalidateQueries([QueryKey.UserInvitations])
      }
    })
  }

  return (
    <>
      <div
        key={invitation.invitationId}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
        onClick={onClick}
        onKeyDown={onClick}
        tabIndex={invitation.invitationId}
        role='button'
      >
        <div className='w-32 text-center'>{idx + 1}</div>
        <div className='w-60 flex'>
          <Avatar
            title={invitation.senderName}
            src={invitation.senderAvatar}
            name={invitation.senderName}
            className='h-9 w-9 border-[1px] hover:border-green-500'
          />
          <span className='ml-3'>{invitation.senderName}</span>
        </div>
        <div className='w-72'>{invitation.senderEmail}</div>
        <div className='w-72 flex'>
          <Avatar
            title={invitation.projectName}
            src={invitation.projectImage}
            name={invitation.projectName}
            className='h-9 w-9 border-[1px] hover:border-green-500'
          />
          <span className='ml-3'>{invitation.projectName}</span>
        </div>

        <div className='flex-grow flex'>
          {invitation.acceptedAt && <span>accept</span>}
          {invitation.declinedAt && <span>declined</span>}

          {!invitation.declinedAt && !invitation.acceptedAt && (
            <div className='flex'>
              <button title='accept_invitation' onClick={handleClickAcceptInvitation} className='btn-icon bg-c-1'>
                <Icon width={22} icon='mdi:check-outline' className='text-green-500' />
              </button>

              <button title='decline_invitation' onClick={handleClickDeclineInvitation} className='btn-icon bg-c-1'>
                <Icon width={22} icon='mdi:close-outline' className='text-red-500' />
              </button>
            </div>
          )}
        </div>
      </div>

      {isShowingAcceptInvitation && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingAcceptInvitation}
            onClose={toggleAcceptInvitation}
            onSubmit={handleAcceptInvitation}
            isLoading={acceptInvitationMutation.isLoading}
            confirmMessage={`submit_accept_invitation` + `: ${invitation.projectName}`}
            closeLabel='cancle'
            submittingLabel='accepting_invitation...'
            submitLabel='accept_invitation'
            submitClassName='btn-alert'
          />
        </Suspense>
      )}

      {isShowingDeclineInvitation && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeclineInvitation}
            onClose={toggleDeclineInvitation}
            onSubmit={handleDeclineInvitation}
            isLoading={declineInvitationMutation.isLoading}
            confirmMessage={`submit_decline_invitation` + `: ${invitation.projectName}`}
            closeLabel='cancle'
            submittingLabel='declining_invitation...'
            submitLabel='decline_invitation'
            submitClassName='btn-alert'
          />
        </Suspense>
      )}
    </>
  )
}
