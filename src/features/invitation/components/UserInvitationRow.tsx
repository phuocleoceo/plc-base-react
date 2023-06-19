import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Suspense, lazy } from 'react'
import { Icon } from '@iconify/react'

import { UserInvitation } from '~/features/invitation/models'
import { InvitationApi } from '~/features/invitation/apis'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { useToggle } from '~/common/hooks'

const AnonymousProfileModal = lazy(() => import('~/features/profile/components/AnonymousProfileModal'))
const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  idx: number
  invitation: UserInvitation
}

export default function ProjectInvitationRow(props: Props) {
  const { idx, invitation } = props

  const { isShowing: isShowingSenderDetail, toggle: toggleSenderDetail } = useToggle()
  const { isShowing: isShowingAcceptInvitation, toggle: toggleAcceptInvitation } = useToggle()
  const { isShowing: isShowingDeclineInvitation, toggle: toggleDeclineInvitation } = useToggle()

  const { t } = useTranslation()
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
        toast.success(t('accept_invitation_success'))
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
        toast.success(t('decline_invitation_success'))
        queryClient.invalidateQueries([QueryKey.UserInvitations])
      }
    })
  }

  return (
    <>
      <div
        key={invitation.invitationId}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
        onClick={toggleSenderDetail}
        onKeyDown={toggleSenderDetail}
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
          {invitation.acceptedAt && <span>{t('accepted')}</span>}
          {invitation.declinedAt && <span>{t('declined')}</span>}

          {!invitation.declinedAt && !invitation.acceptedAt && (
            <div className='flex'>
              <button title='accept_invitation' onClick={handleClickAcceptInvitation} className='btn-icon bg-c-1'>
                <Icon width={22} icon='mdi:check-bold' className='text-green-500' />
              </button>

              <button title='decline_invitation' onClick={handleClickDeclineInvitation} className='btn-icon bg-c-1'>
                <Icon width={22} icon='mdi:close-bold' className='text-red-500' />
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
            isMutating={acceptInvitationMutation.isLoading}
            confirmMessage={t('submit_accept_invitation') + `: ${invitation.projectName}`}
            closeLabel={t('cancle')}
            submittingLabel={t('accepting_invitation...')}
            submitLabel={t('accept_invitation')}
            className='max-w-[25rem]'
          />
        </Suspense>
      )}

      {isShowingDeclineInvitation && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeclineInvitation}
            onClose={toggleDeclineInvitation}
            onSubmit={handleDeclineInvitation}
            isMutating={declineInvitationMutation.isLoading}
            confirmMessage={t('submit_decline_invitation') + `: ${invitation.projectName}`}
            closeLabel={t('cancle')}
            submittingLabel={t('declining_invitation...')}
            submitLabel={t('decline_invitation')}
            submitClassName='btn-alert'
            className='max-w-[25rem]'
          />
        </Suspense>
      )}

      {isShowingSenderDetail && (
        <Suspense>
          <AnonymousProfileModal
            userId={invitation.senderId}
            isShowing={isShowingSenderDetail}
            onClose={toggleSenderDetail}
          />
        </Suspense>
      )}
    </>
  )
}
