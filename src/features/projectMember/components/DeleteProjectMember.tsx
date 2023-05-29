import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { ProjectMemberApi } from '~/features/projectMember/apis'
import { QueryKey } from '~/shared/constants'
import { Modal } from '~/common/components'

interface Props {
  projectId: number
  projectMemberId: number
  projectMemberName: string
  isShowing: boolean
  onClose: () => void
}

export default function DeleteProject(props: Props) {
  const { projectId, projectMemberId, projectMemberName, isShowing, onClose } = props

  const queryClient = useQueryClient()

  const deleteProjectMemberMutation = useMutation({
    mutationFn: () => ProjectMemberApi.deleteProjectMember(projectId, projectMemberId)
  })

  const handleDeleteProjectMember = async () => {
    deleteProjectMemberMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('delete_project_member_success')
        queryClient.invalidateQueries([QueryKey.ProjectMembers])
        onClose()
      }
    })
  }

  return (
    <Modal
      onSubmit={handleDeleteProjectMember}
      isLoading={deleteProjectMemberMutation.isLoading}
      closeLabel='cancle'
      submittingLabel='deleting_project_member...'
      submitLabel='delete_project_member'
      submitClassName='btn-alert'
      {...{ isShowing, onClose }}
    >
      <div>
        <label htmlFor={projectMemberName} className='text-sm tracking-wide text-gray-800'>
          {`submit_delete_project_member` + `: ${projectMemberName}`}
        </label>
      </div>
    </Modal>
  )
}
