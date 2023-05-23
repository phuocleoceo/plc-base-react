import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { CreateProjectRequest } from '~/features/project/models'
import { InputValidation, Modal, ImageUpload } from '~/common/components'
import { ProjectApi } from '~/features/project/apis'
import { ValidationHelper } from '~/shared/helpers'
import { MediaApi } from '~/features/media/apis'

interface Props {
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreateProjectRequest, 'name' | 'image' | 'key'>

export default function CreateProject(props: Props) {
  const { isShowing, onClose } = props
  const queryClient = useQueryClient()

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting: isLoading }
  } = useForm<FormData>()

  const createProjectMutation = useMutation({
    mutationFn: (body: CreateProjectRequest) => ProjectApi.createProject(body)
  })

  const handleCreateProject = handleSubmit((form: FormData) => {
    const projectData: CreateProjectRequest = {
      ...form,
      image: 'string'
    }

    createProjectMutation.mutate(projectData, {
      onSuccess: () => {
        toast.success('create_project_success')
        queryClient.invalidateQueries(['projects'])
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

  const handleSelectImage = (image: File) => {
    console.log(image)
  }

  return (
    <Modal
      onSubmit={handleCreateProject}
      closeLabel='cancle'
      submittingLabel='creating...'
      submitLabel='create'
      {...{ isShowing, onClose, isLoading }}
    >
      <>
        <div className='mb-8'>
          <span className='text-[22px] font-[600] text-c-text'>create_project</span>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-4'>
            <InputValidation
              label='project_name'
              placeholder='your_project_name...'
              register={register('name', {
                required: {
                  value: true,
                  message: 'project_name_required'
                }
              })}
              error={errors.name as FieldError}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <InputValidation
              label='project_key'
              placeholder='your_project_key...'
              register={register('key', {
                required: {
                  value: true,
                  message: 'project_key_required'
                }
              })}
              error={errors.key as FieldError}
            />
          </div>

          <div className='flex flex-col gap-4'>
            <ImageUpload onSelectedImage={handleSelectImage} />
          </div>
        </div>
      </>
    </Modal>
  )
}
