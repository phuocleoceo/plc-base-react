import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { useTranslation } from 'react-i18next'

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

  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
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
        toast.success(t('create_invitation_success'))
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
      isMutating={createInvitationMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('sending...')}
      submitLabel={t('send')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-4'>
          <span className='text-[22px] font-[600] text-c-text'>{t('create_invitation')}</span>
        </div>
        <div className='flex flex-col gap-4'>
          <InputValidation
            label={t('recipient_email')}
            placeholder={t('enter_email_to_invite...')}
            register={register('recipientEmail', {
              required: {
                value: true,
                message: t('recipient_email_required')
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
