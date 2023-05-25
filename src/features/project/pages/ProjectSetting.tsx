import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { ImageUpload, InputValidation, LabelWrapper, SelectBox, SpinningCircle } from '~/common/components'
import { UpdateProjectRequest } from '~/features/project/models'
import { SelectItem } from '~/common/components/SelectBox'
import { ProjectApi } from '~/features/project/apis'
import { ValidationHelper } from '~/shared/helpers'
import { MediaApi } from '~/features/media/apis'
import { AppContext } from '~/common/contexts'

type FormData = Pick<UpdateProjectRequest, 'name' | 'key' | 'leaderId'>

export default function ProjectSetting() {
  const projectId = Number(useParams().projectId)
  const [selectedImage, setSelectedImage] = useState<File>()

  const queryClient = useQueryClient()

  const { isAuthenticated } = useContext(AppContext)

  const { data, isLoading } = useQuery({
    queryKey: ['project'],
    queryFn: () => ProjectApi.getProjectById(projectId),
    enabled: isAuthenticated,
    staleTime: 100
  })

  const project = data?.data.data

  const {
    reset,
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const updateProjectMutation = useMutation({
    mutationFn: (body: UpdateProjectRequest) => ProjectApi.updateProject(projectId, body)
  })

  const handleUpdateProfile = handleSubmit(async (form: FormData) => {
    let imageUrl = ''
    try {
      const imageUploadResponse = await MediaApi.uploadFile(selectedImage)
      imageUrl = imageUploadResponse?.data.data || project?.image || ''
    } catch {
      imageUrl = project?.image || ''
    }

    const projectData: UpdateProjectRequest = {
      ...form,
      image: imageUrl,
      leaderId: 1
    }

    updateProjectMutation.mutate(projectData, {
      onSuccess: () => {
        toast.success('update_project_success')
        queryClient.invalidateQueries(['project'])
        reset()
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  const handleSelectImage = async (image: File) => {
    setSelectedImage(image)
  }

  return isLoading ? (
    <div className='mt-10 flex justify-center'>
      <SpinningCircle height={50} width={50} />
    </div>
  ) : (
    <div className='px-5 sm:px-10'>
      <h1 className='mb-4 text-xl font-semibold text-c-text'>project_setting</h1>

      <form onSubmit={handleUpdateProfile} className='flex max-w-[30rem] flex-col gap-4'>
        <div>
          <ImageUpload originImage={project?.image} onSelectedImage={handleSelectImage} />
        </div>

        <InputValidation
          label='name'
          defaultValue={project?.name}
          placeholder='enter_project_name...'
          register={register('name', {
            required: { value: true, message: 'project_name_required' }
          })}
          error={errors.name as FieldError}
        />
        <InputValidation
          label='key'
          defaultValue={project?.key}
          placeholder='enter_project_key...'
          register={register('key', {
            required: { value: true, message: 'project_key_required' }
          })}
          error={errors.key as FieldError}
        />
        <div className='mt-2'>
          <button className='btn mt-3'>{isSubmitting ? 'saving_changes...' : 'save_changes'}</button>
        </div>
      </form>
    </div>
  )
}
