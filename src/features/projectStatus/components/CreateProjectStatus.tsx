import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { CreateProjectStatusRequest } from '~/features/projectStatus/models'
import { ProjectStatusApi } from '~/features/projectStatus/apis'
import { InputValidation, Modal } from '~/common/components'
import { ValidationHelper } from '~/shared/helpers'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreateProjectStatusRequest, 'name'>

export default function CreateProjectStatus(props: Props) {
  const { projectId, isShowing, onClose } = props
  const queryClient = useQueryClient()

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting: isLoading }
  } = useForm<FormData>()

  const createProjectStatusMutation = useMutation({
    mutationFn: (body: CreateProjectStatusRequest) => ProjectStatusApi.createProjectStatus(projectId, body)
  })

  const handleCreateProjectStatus = handleSubmit(async (form: FormData) => {
    const projectStatusData: CreateProjectStatusRequest = {
      ...form
    }

    createProjectStatusMutation.mutate(projectStatusData, {
      onSuccess: () => {
        toast.success('create_status_success')
        queryClient.invalidateQueries([QueryKey.ProjectStatuses])
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
      onSubmit={handleCreateProjectStatus}
      closeLabel='cancle'
      submittingLabel='creating...'
      submitLabel='create'
      {...{ isShowing, onClose, isLoading }}
    >
      <>
        <div className='mb-4'>
          <span className='text-[22px] font-[600] text-c-text'>create_project_status</span>
        </div>
        <div className='flex flex-col gap-4'>
          <InputValidation
            label='name'
            placeholder='enter_project_status_name...'
            register={register('name', {
              required: {
                value: true,
                message: 'name_required'
              }
            })}
            error={errors.name as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </div>
      </>
    </Modal>
  )
}
