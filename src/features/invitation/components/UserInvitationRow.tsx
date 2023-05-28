import { lazy, Suspense } from 'react'
import { Icon } from '@iconify/react'

import { Avatar } from '~/common/components'
import { useShowing } from '~/common/hooks'

const DeleteProjectInvitation = lazy(() => import('~/features/invitation/components/DeleteProjectInvitation'))

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

  const handleDeleteProjectMember = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleDeleteInvitation()
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
            onClick={handleDeleteProjectMember}
            className='btn-icon absolute ml-2 bg-c-1'
          >
            <Icon width={22} icon='bx:trash' className='text-red-500' />
          </button>
        </div>
      </div>

      {isShowingDeleteInvitation && (
        <Suspense>
          <DeleteProjectInvitation
            projectId={projectId}
            invitationId={invitationId}
            recipientEmail={recipientEmail}
            isShowing={isShowingDeleteInvitation}
            onClose={toggleDeleteInvitation}
          />
        </Suspense>
      )}
    </>
  )
}
