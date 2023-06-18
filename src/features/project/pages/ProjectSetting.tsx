import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useState, lazy, Suspense } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import * as _ from 'lodash'

import { ImageUpload, InputValidation, LabelWrapper, SelectBox, SpinningCircle } from '~/common/components'
import { UpdateProjectRequest } from '~/features/project/models'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { ProjectApi } from '~/features/project/apis'
import { ValidationHelper } from '~/shared/helpers'
import { MediaApi } from '~/features/media/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'
import { SelectItem } from '~/shared/types'

const DeleteProject = lazy(() => import('~/features/project/components/DeleteProject'))

type FormData = Pick<UpdateProjectRequest, 'name' | 'key' | 'leaderId'>

export default function ProjectSetting() {
  const projectId = Number(useParams().projectId)
  const { isAuthenticated } = useContext(AppContext)
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

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: [QueryKey.ProjectDetail, projectId],
    queryFn: () => ProjectApi.getProjectById(projectId),
    enabled: isAuthenticated,
    staleTime: 1000
  })

  const project = projectData?.data.data

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
      const imageUploadResponse = await MediaApi.uploadFile(selectedImage)
      imageUrl = imageUploadResponse?.data.data || project?.image || ''
    } catch {
      imageUrl = project?.image || ''
    }

    const updateProjectData: UpdateProjectRequest = {
      ...form,
      image: imageUrl
    }

    updateProjectMutation.mutate(updateProjectData, {
      onSuccess: () => {
        toast.success('update_project_success')
        queryClient.invalidateQueries([QueryKey.ProjectDetail, projectId])
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

  return projectLoading || projectMemberLoading ? (
    <div className='mt-10 flex justify-center'>
      <SpinningCircle height={50} width={50} />
    </div>
  ) : (
    <>
      <div className='px-5 sm:px-10 mt-6'>
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

          <LabelWrapper label='leader' margin='mt-1'>
            <SelectBox
              control={control}
              controlField='leaderId'
              selectList={projectMembers}
              defaultValue={project?.leaderId.toString()}
              className='w-full'
            />
          </LabelWrapper>

          <div className='mt-2 flex justify-around'>
            <button type='submit' className='btn w-2/5'>
              {isSubmitting ? 'saving_changes...' : 'save_changes'}
            </button>

            <div
              onClick={toggleDeleteProject}
              onKeyDown={toggleDeleteProject}
              className='btn-alert w-2/5 text-center cursor-pointer'
              role='button'
              tabIndex={0}
            >
              delete_project
            </div>
          </div>
        </form>
      </div>

      {isShowingDeleteProject && (
        <Suspense>
          <DeleteProject
            project={_.pick(project, ['id', 'name'])}
            isShowing={isShowingDeleteProject}
            onClose={toggleDeleteProject}
          />
        </Suspense>
      )}
    </>
  )
}
