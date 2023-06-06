import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { CreateInvitationForProjectRequest } from '~/features/invitation/models'
import { InputValidation, Modal } from '~/common/components'
import { InvitationApi } from '~/features/invitation/apis'
import { ValidationHelper } from '~/shared/helpers'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreateInvitationForProjectRequest, 'recipientEmail'>

export default function CreateProjectInvitation(props: Props) {
  const { projectId, isShowing, onClose } = props
  const queryClient = useQueryClient()

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting: isLoading }
  } = useForm<FormData>()

  const createInvitationMutation = useMutation({
    mutationFn: (body: CreateInvitationForProjectRequest) => InvitationApi.createInvitationForProject(projectId, body)
  })

  const handleCreateProjectInvitation = handleSubmit((form: FormData) => {
    const invitationData: CreateInvitationForProjectRequest = {
      ...form
    }

    createInvitationMutation.mutate(invitationData, {
      onSuccess: () => {
        toast.success('create_invitation_success')
        queryClient.invalidateQueries([QueryKey.ProjectInvitations])
        reset()
        onClose()
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  return (
    <Modal
      onSubmit={handleCreateProjectInvitation}
      closeLabel='cancle'
      submittingLabel='sending...'
      submitLabel='send'
      {...{ isShowing, onClose, isLoading }}
    >
      <>
        <div className='mb-4'>
          <span className='text-[22px] font-[600] text-c-text'>create_invitation</span>
        </div>
        <div className='flex flex-col gap-4'>
          <InputValidation
            label='recipient_email'
            placeholder='enter_email_to_invite...'
            register={register('recipientEmail', {
              required: {
                value: true,
                message: 'recipient_email_required'
              }
            })}
            error={errors.recipientEmail as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </div>
      </>
    </Modal>
  )
}
