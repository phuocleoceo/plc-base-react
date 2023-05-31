import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'

import { ProjectMemberApi } from '~/features/projectMember/apis'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { useShowing } from '~/common/hooks'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  idx: number
  id: number
  email: string
  name: string
  avatar: string
  projectMemberId: number
  projectId: number
  onClick: () => void
}

export default function ProjectMemberRow(props: Props) {
  const { idx, id, name, email, avatar, projectMemberId, projectId, onClick } = props

  const { isShowing: isShowingDeleteMember, toggle: toggleDeleteMember } = useShowing()

  const queryClient = useQueryClient()

  const handleClickDeleteProjectMember = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleDeleteMember()
  }

  const deleteProjectMemberMutation = useMutation({
    mutationFn: () => ProjectMemberApi.deleteProjectMember(projectId, projectMemberId)
  })

  const handleDeleteProjectMember = async () => {
    deleteProjectMemberMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('delete_project_member_success')
        queryClient.invalidateQueries([QueryKey.ProjectMembers])
        toggleDeleteMember()
      }
    })
  }

  return (
    <>
      <div
        key={id}
        className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
        onClick={onClick}
        onKeyDown={onClick}
        tabIndex={id}
        role='button'
      >
        <div className='w-32 text-center'>{idx + 1}</div>
        <div className='w-60 flex'>
          <Avatar title={name} src={avatar} name={name} className='h-9 w-9 border-[1px] hover:border-green-500' />
          <span className='ml-3'>{name}</span>
        </div>
        <div className='w-72'>{email}</div>
        <div className='flex-grow flex'>
          <button
            title='delete_project_member'
            onClick={handleClickDeleteProjectMember}
            className='btn-icon absolute ml-2 bg-c-1'
          >
            <Icon width={22} icon='bx:trash' className='text-red-500' />
          </button>
        </div>
      </div>

      {isShowingDeleteMember && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteMember}
            onClose={toggleDeleteMember}
            onSubmit={handleDeleteProjectMember}
            isLoading={deleteProjectMemberMutation.isLoading}
            confirmMessage={`submit_delete_project_member` + `: ${name}`}
            closeLabel='cancle'
            submittingLabel='deleting_project_member...'
            submitLabel='delete_project_member'
            submitClassName='btn-alert'
          />
        </Suspense>
      )}
    </>
  )
}
