import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { UpdateProjectRoleRequest } from '~/features/admin/features/projectRole/models'
import { ProjectRoleApi } from '~/features/admin/features/projectRole/apis'
import { InputValidation, Modal } from '~/common/components'
import { ValidationHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectRoleId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<UpdateProjectRoleRequest, 'name' | 'description'>

export default function UpdateProjectRole(props: Props) {
  const { projectRoleId, isShowing, onClose } = props

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { data: projectRoleData, isLoading: isLoadingProjectRole } = useQuery({
    queryKey: [QueryKey.ProjectRole, projectRoleId],
    queryFn: () => ProjectRoleApi.getProjectRole(projectRoleId),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const projectRole = projectRoleData?.data.data

  const updateProjectRoleMutation = useMutation({
    mutationFn: (body: UpdateProjectRoleRequest) => ProjectRoleApi.updateProjectRole(projectRoleId, body)
  })

  const handleUpdateProjectRole = handleSubmit((form: FormData) => {
    const projectRoleData: UpdateProjectRoleRequest = {
      ...form
    }

    updateProjectRoleMutation.mutate(projectRoleData, {
      onSuccess: () => {
        toast.success('update_project_role_success')
        queryClient.invalidateQueries([QueryKey.ProjectRoles])
        queryClient.invalidateQueries([QueryKey.ProjectRole, projectRoleId])
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
      isLoading={isLoadingProjectRole}
      onSubmit={handleUpdateProjectRole}
      isMutating={updateProjectRoleMutation.isLoading || isSubmitting}
      closeLabel='cancle'
      submittingLabel='updating_project_role...'
      submitLabel='update_project_role'
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-3'>
          <span className='text-[22px] font-[600] text-c-text'>update_project_role</span>
        </div>

        <div className='flex flex-col gap-4'>
          <InputValidation
            label='name'
            placeholder='name...'
            register={register('name', {
              required: {
                value: true,
                message: 'name_required'
              }
            })}
            error={errors.name as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            defaultValue={projectRole?.name}
          />

          <InputValidation
            label='description'
            placeholder='description...'
            register={register('description', {
              required: {
                value: true,
                message: 'description_required'
              }
            })}
            error={errors.description as FieldError}
            defaultValue={projectRole?.description}
          />
        </div>
      </>
    </Modal>
  )
}
