import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useState } from 'react'

import { ConfigSettingApi } from '~/features/admin/features/configSetting/apis'
import { InputValidation, Modal, ImageUpload } from '~/common/components'
import { CreateProjectRequest } from '~/features/project/models'
import { ProjectApi } from '~/features/project/apis'
import { ValidationHelper } from '~/shared/helpers'
import { MediaApi } from '~/features/media/apis'
import { QueryKey } from '~/shared/constants'

interface Props {
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreateProjectRequest, 'name' | 'key'>

export default function CreateProject(props: Props) {
  const { isShowing, onClose } = props
  const [selectedImage, setSelectedImage] = useState<File>()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: freeProjectData, isLoading: isLoadingFreeProject } = useQuery({
    queryKey: [QueryKey.ConfigSettingDetail, 'free_project'],
    queryFn: () => ConfigSettingApi.getConfigSettingDetail('free_project'),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  })
  const freeProject = freeProjectData?.data.data

  const { data: projectPriceData, isLoading: isLoadingProjectPrice } = useQuery({
    queryKey: [QueryKey.ConfigSettingDetail, 'project_price'],
    queryFn: () => ConfigSettingApi.getConfigSettingDetail('project_price'),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  })
  const projectPrice = projectPriceData?.data.data

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const createProjectMutation = useMutation({
    mutationFn: (body: CreateProjectRequest) => ProjectApi.createProject(body)
  })

  const handleCreateProject = handleSubmit(async (form: FormData) => {
    let imageUrl = ''
    try {
      const imageUploadResponse = await MediaApi.uploadFile(selectedImage)
      imageUrl = imageUploadResponse?.data.data || ''
    } catch {
      imageUrl = ''
    }

    const projectData: CreateProjectRequest = {
      ...form,
      image: imageUrl
    }

    createProjectMutation.mutate(projectData, {
      onSuccess: () => {
        toast.success(t('create_project_success'))
        queryClient.invalidateQueries([QueryKey.Projects])
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

  const handleSelectImage = async (image: File) => {
    setSelectedImage(image)
  }

  return (
    <Modal
      isLoading={isLoadingFreeProject || isLoadingProjectPrice}
      onSubmit={handleCreateProject}
      isMutating={createProjectMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('creating...')}
      submitLabel={t('create')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-8'>
          <span className='text-[22px] font-[600] text-c-text'>{t('create_project')}</span>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-4'>
            <InputValidation
              label={t('project_name')}
              placeholder={t('your_project_name...')}
              register={register('name', {
                required: {
                  value: true,
                  message: t('project_name_required')
                }
              })}
              error={errors.name as FieldError}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <InputValidation
              label={t('project_key')}
              placeholder={t('your_project_key...')}
              register={register('key', {
                required: {
                  value: true,
                  message: t('project_key_required')
                }
              })}
              error={errors.key as FieldError}
            />
          </div>

          <div className='flex flex-col gap-4'>
            <ImageUpload onSelectedImage={handleSelectImage} />
          </div>
        </div>

        <div className='text-sm text-gray-500 mt-3'>
          <div>{`${t('free_project')}: ${freeProject?.value}`}</div>
          <div>{`${t('project_price')}: ${projectPrice?.value}`}</div>
        </div>
      </>
    </Modal>
  )
}
