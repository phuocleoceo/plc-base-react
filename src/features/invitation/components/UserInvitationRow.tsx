import { Icon } from '@iconify/react'

import { Avatar } from '~/common/components'
import { useShowing } from '~/common/hooks'

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

  // const { isShowing: isShowingDeleteInvitation, toggle: toggleDeleteInvitation } = useShowing()

  const handleDeleteProjectMember = (event: React.MouseEvent) => {
    event.stopPropagation()
    // toggleDeleteInvitation()
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
    </>
  )
}
