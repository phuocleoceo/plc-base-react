import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { InvitationApi } from '~/features/invitation/apis'
import { Modal } from '~/common/components'

interface Props {
  projectId: number
  invitationId: number
  recipientEmail: string
  isShowing: boolean
  onClose: () => void
}

export default function DeleteProjectInvitation(props: Props) {
  const { projectId, invitationId, recipientEmail, isShowing, onClose } = props

  const queryClient = useQueryClient()

  const deleteProjectinvitationMutation = useMutation({
    mutationFn: () => InvitationApi.deleteInvitationForProject(projectId, invitationId)
  })

  const handleDeleteProjectInvitation = async () => {
    deleteProjectinvitationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('delete_project_invitation_success')
        queryClient.invalidateQueries(['projectInvitations'])
        onClose()
      }
    })
  }

  return (
    <Modal
      onSubmit={handleDeleteProjectInvitation}
      isLoading={deleteProjectinvitationMutation.isLoading}
      closeLabel='cancle'
      submittingLabel='deleting_project_invitation...'
      submitLabel='delete_project_invitation'
      submitClassName='btn-alert'
      {...{ isShowing, onClose }}
    >
      <div>
        <label htmlFor={recipientEmail} className='text-sm tracking-wide text-gray-800'>
          {`submit_delete_project_invitation` + `: ${recipientEmail}`}
        </label>
      </div>
    </Modal>
  )
}
