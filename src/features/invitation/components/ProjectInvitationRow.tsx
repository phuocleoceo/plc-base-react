import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { lazy, Suspense } from 'react'
import { Icon } from '@iconify/react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ProjectInvitation } from '~/features/invitation/models'
import { useProjectPermission } from '~/features/project/hooks'
import { InvitationApi } from '~/features/invitation/apis'
import { InvitationPermission } from '~/shared/enums'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { useToggle } from '~/common/hooks'

const AnonymousProfileModal = lazy(() => import('~/features/profile/components/AnonymousProfileModal'))
const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  idx: number
  projectId: number
  invitation: ProjectInvitation
}

export default function ProjectInvitationRow(props: Props) {
  const { idx, projectId, invitation } = props

  const { isShowing: isShowingRecipientDetail, toggle: toggleRecipientDetail } = useToggle()
  const { isShowing: isShowingDeleteInvitation, toggle: toggleDeleteInvitation } = useToggle()

  const { t } = useTranslation()
  const { hasPermission } = useProjectPermission(projectId)

  const queryClient = useQueryClient()

  const handleClickDeleteProjectInvitation = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleDeleteInvitation()
  }

  const deleteProjectinvitationMutation = useMutation({
    mutationFn: () => InvitationApi.deleteInvitationForProject(projectId, invitation.invitationId)
  })

  const handleDeleteProjectInvitation = async () => {
    deleteProjectinvitationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('delete_project_invitation_success'))
        queryClient.invalidateQueries([QueryKey.ProjectInvitations])
        toggleDeleteInvitation()
      }
    })
  }

  return (
    <>
      <div
        key={invitation.invitationId}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
        onClick={toggleRecipientDetail}
        onKeyDown={toggleRecipientDetail}
        tabIndex={invitation.invitationId}
        role='button'
      >
        <div className='w-32 text-center'>{idx + 1}</div>
        <div className='w-60 flex'>
          <Avatar
            title={invitation.recipientName}
            src={invitation.recipientAvatar}
            name={invitation.recipientName}
            className='h-9 w-9 border-[1px] hover:border-green-500'
          />
          <span className='ml-3'>{invitation.recipientName}</span>
        </div>
        <div className='w-72'>{invitation.recipientEmail}</div>

        {invitation.acceptedAt && <div className='w-64'>{t('accepted')}</div>}
        {invitation.declinedAt && <div className='w-64'>{t('declined')}</div>}
        {!invitation.declinedAt && !invitation.acceptedAt && <div className='w-64'>{t('pending')}</div>}

        <div className='flex-grow flex'>
          {hasPermission(InvitationPermission.Delete) && (
            <button
              title='delete_project_member'
              onClick={handleClickDeleteProjectInvitation}
              className='btn-icon absolute ml-2 bg-c-1'
            >
              <Icon width={22} icon='bx:trash' className='text-red-500' />
            </button>
          )}
        </div>
      </div>

      {isShowingDeleteInvitation && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteInvitation}
            onClose={toggleDeleteInvitation}
            onSubmit={handleDeleteProjectInvitation}
            isMutating={deleteProjectinvitationMutation.isLoading}
            confirmMessage={t(`submit_delete_project_invitation`) + `: ${invitation.recipientEmail}`}
            closeLabel={t('cancle')}
            submittingLabel={t('deleting_project_invitation...')}
            submitLabel={t('delete_project_invitation')}
            submitClassName='btn-alert'
          />
        </Suspense>
      )}

      {isShowingRecipientDetail && (
        <Suspense>
          <AnonymousProfileModal
            userId={invitation.recipientId}
            isShowing={isShowingRecipientDetail}
            onClose={toggleRecipientDetail}
          />
        </Suspense>
      )}
    </>
  )
}
