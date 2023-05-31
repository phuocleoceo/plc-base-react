import { toast } from 'react-toastify'
import { lazy, Suspense } from 'react'
import { Icon } from '@iconify/react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InvitationApi } from '~/features/invitation/apis'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { useShowing } from '~/common/hooks'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  idx: number
  projectId: number
  invitationId: number
  recipientId: number
  recipientName: string
  recipientEmail: string
  recipientAvatar: string
  acceptedAt: Date
  declinedAt: Date
  onClick?: () => void
}

export default function ProjectInvitationRow(props: Props) {
  const {
    idx,
    invitationId,
    recipientName,
    recipientEmail,
    recipientAvatar,
    acceptedAt,
    declinedAt,
    projectId,
    onClick
  } = props

  const { isShowing: isShowingDeleteInvitation, toggle: toggleDeleteInvitation } = useShowing()

  const queryClient = useQueryClient()

  const handleClickDeleteProjectInvitation = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleDeleteInvitation()
  }

  const deleteProjectinvitationMutation = useMutation({
    mutationFn: () => InvitationApi.deleteInvitationForProject(projectId, invitationId)
  })

  const handleDeleteProjectInvitation = async () => {
    deleteProjectinvitationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('delete_project_invitation_success')
        queryClient.invalidateQueries([QueryKey.ProjectInvitations])
        toggleDeleteInvitation()
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
            title={recipientName}
            src={recipientAvatar}
            name={recipientName}
            className='h-9 w-9 border-[1px] hover:border-green-500'
          />
          <span className='ml-3'>{recipientName}</span>
        </div>
        <div className='w-72'>{recipientEmail}</div>

        {acceptedAt && <div className='w-64'>accept</div>}
        {declinedAt && <div className='w-64'>declined</div>}
        {!declinedAt && !acceptedAt && <div className='w-64'>pending</div>}

        <div className='flex-grow flex'>
          <button
            title='delete_project_member'
            onClick={handleClickDeleteProjectInvitation}
            className='btn-icon absolute ml-2 bg-c-1'
          >
            <Icon width={22} icon='bx:trash' className='text-red-500' />
          </button>
        </div>
      </div>

      {isShowingDeleteInvitation && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteInvitation}
            onClose={toggleDeleteInvitation}
            onSubmit={handleDeleteProjectInvitation}
            isLoading={deleteProjectinvitationMutation.isLoading}
            confirmMessage={`submit_delete_project_invitation` + `: ${recipientEmail}`}
            closeLabel='cancle'
            submittingLabel='deleting_project_invitation...'
            submitLabel='delete_project_invitation'
            submitClassName='btn-alert'
          />
        </Suspense>
      )}
    </>
  )
}
