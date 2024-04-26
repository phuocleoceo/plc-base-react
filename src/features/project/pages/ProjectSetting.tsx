import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useState, lazy, Suspense } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import * as _ from 'lodash'

import { ImageUpload, InputValidation, LabelWrapper, SelectBox, SpinningCircle } from '~/common/components'
import { useCurrentProject, useProjectPermission } from '~/features/project/hooks'
import { ValidationHelper, UploadHelper } from '~/shared/helpers'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { UpdateProjectRequest } from '~/features/project/models'
import { ProjectApi } from '~/features/project/apis'
import { ProjectPermission } from '~/shared/enums'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { SelectItem } from '~/shared/types'
import { useToggle } from '~/common/hooks'

const DeleteProject = lazy(() => import('~/features/project/components/DeleteProject'))

type FormData = Pick<UpdateProjectRequest, 'name' | 'key' | 'leaderId'>

export default function ProjectSetting() {
  const projectId = Number(useParams().projectId)

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const { hasPermission } = useProjectPermission(projectId)

  const [selectedImage, setSelectedImage] = useState<File>()
  const { isShowing: isShowingDeleteProject, toggle: toggleDeleteProject } = useToggle()

  const queryClient = useQueryClient()

  const {
    reset,
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const { currentProject, isLoadingProject } = useCurrentProject(projectId)

  const { data: projectMemberData, isLoading: projectMemberLoading } = useQuery({
    queryKey: [QueryKey.ProjectMemberSelect, projectId],
    queryFn: () => ProjectMemberApi.getMemberForSelect(projectId),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const projectMembers: SelectItem[] =
    projectMemberData?.data.data.map((pm) => ({
      label: pm.name,
      value: pm.id.toString(),
      icon: pm.avatar
    })) || []

  const updateProjectMutation = useMutation({
    mutationFn: (body: UpdateProjectRequest) => ProjectApi.updateProject(projectId, body)
  })

  const handleUpdateProfile = handleSubmit(async (form: FormData) => {
    let imageUrl = ''
    try {
      imageUrl = (await UploadHelper.upload(selectedImage)) || currentProject?.image || ''
    } catch {
      imageUrl = currentProject?.image || ''
    }

    const updateProjectData: UpdateProjectRequest = {
      ...form,
      image: imageUrl
    }

    updateProjectMutation.mutate(updateProjectData, {
      onSuccess: () => {
        toast.success(t('update_project_success'))
        queryClient.invalidateQueries([QueryKey.ProjectDetail, projectId])
        queryClient.invalidateQueries([QueryKey.Projects])
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

  return isLoadingProject || projectMemberLoading ? (
    <div className='mt-10 flex justify-center'>
      <SpinningCircle height={50} width={50} />
    </div>
  ) : (
    <>
      <div className='px-5 sm:px-10 mt-6'>
        <h1 className='mb-4 text-xl font-semibold text-c-text'>{t('project_setting')}</h1>

        <form onSubmit={handleUpdateProfile} className='flex max-w-[30rem] flex-col gap-4'>
          <div>
            <ImageUpload originImage={currentProject?.image} onSelectedImage={handleSelectImage} />
          </div>

          <InputValidation
            label={t('name')}
            defaultValue={currentProject?.name}
            placeholder={t('enter_project_name...')}
            register={register('name', {
              required: { value: true, message: t('project_name_required') }
            })}
            error={errors.name as FieldError}
          />
          <InputValidation
            label={t('key')}
            defaultValue={currentProject?.key}
            placeholder={t('enter_project_key...')}
            register={register('key', {
              required: { value: true, message: t('project_key_required') }
            })}
            error={errors.key as FieldError}
          />

          <LabelWrapper label={t('leader')} margin='mt-1'>
            <SelectBox
              control={control}
              controlField='leaderId'
              selectList={projectMembers}
              defaultValue={currentProject?.leaderId.toString()}
              className='w-full'
            />
          </LabelWrapper>

          <div className='mt-2 flex justify-around'>
            {hasPermission(ProjectPermission.Update) && (
              <button type='submit' className='btn w-2/5'>
                {isSubmitting ? t('saving_changes...') : t('save_changes')}
              </button>
            )}

            {hasPermission(ProjectPermission.Delete) && (
              <div
                onClick={toggleDeleteProject}
                onKeyDown={toggleDeleteProject}
                className='btn-alert w-2/5 text-center cursor-pointer'
                role='button'
                tabIndex={0}
              >
                {t('delete_project')}
              </div>
            )}
          </div>
        </form>
      </div>

      {isShowingDeleteProject && (
        <Suspense>
          <DeleteProject
            project={_.pick(currentProject, ['id', 'name'])}
            isShowing={isShowingDeleteProject}
            onClose={toggleDeleteProject}
          />
        </Suspense>
      )}
    </>
  )
}
