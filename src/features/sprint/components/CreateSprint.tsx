import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { InputValidation, Modal } from '~/common/components'
import { CreateSprintRequest } from '~/features/sprint/models'
import { ValidationHelper } from '~/shared/helpers'
import { SprintApi } from '~/features/sprint/apis'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreateSprintRequest, 'title' | 'goal' | 'fromDate' | 'toDate'>

export default function CreateSprint(props: Props) {
  const { projectId, isShowing, onClose } = props

  const {
    reset,
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const queryClient = useQueryClient()

  const createSprintMutation = useMutation({
    mutationFn: (body: CreateSprintRequest) => SprintApi.createSprint(projectId, body)
  })

  const handleCreateIssue = handleSubmit((form: FormData) => {
    const issueData: CreateSprintRequest = {
      ...form
    }

    createSprintMutation.mutate(issueData, {
      onSuccess: () => {
        toast.success('create_sprint_success')
        queryClient.invalidateQueries([QueryKey.Sprint])
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
      onSubmit={handleCreateIssue}
      isMutating={createSprintMutation.isLoading || isSubmitting}
      closeLabel='cancle'
      submittingLabel='creating_sprint...'
      submitLabel='create_sprint'
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-3'>
          <span className='text-[22px] font-[600] text-c-text'>create_sprint</span>
        </div>

        <div className='flex flex-col gap-4'>
          <InputValidation
            label='title'
            placeholder='title...'
            register={register('title', {
              required: {
                value: true,
                message: 'title_required'
              }
            })}
            error={errors.title as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />

          <InputValidation
            label='goal'
            placeholder='goal...'
            register={register('goal', {
              required: {
                value: true,
                message: 'goal_required'
              }
            })}
            error={errors.goal as FieldError}
          />
        </div>
      </>
    </Modal>
  )
}
