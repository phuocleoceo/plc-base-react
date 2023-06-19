import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { CreateProjectRoleRequest } from '~/features/admin/features/projectRole/models'
import { ProjectRoleApi } from '~/features/admin/features/projectRole/apis'
import { InputValidation, Modal } from '~/common/components'
import { ValidationHelper } from '~/shared/helpers'
import { QueryKey } from '~/shared/constants'

interface Props {
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreateProjectRoleRequest, 'name' | 'description'>

export default function CreateProjectRole(props: Props) {
  const { isShowing, onClose } = props

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const createProjectRoleMutation = useMutation({
    mutationFn: (body: CreateProjectRoleRequest) => ProjectRoleApi.createProjectRole(body)
  })

  const handleCreateProjectRole = handleSubmit((form: FormData) => {
    const projectRoleData: CreateProjectRoleRequest = {
      ...form
    }

    createProjectRoleMutation.mutate(projectRoleData, {
      onSuccess: () => {
        toast.success(t('create_project_role_success'))
        queryClient.invalidateQueries([QueryKey.ProjectRoles])
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
      onSubmit={handleCreateProjectRole}
      isMutating={createProjectRoleMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('creating_project_role...')}
      submitLabel={t('create_project_role')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-3'>
          <span className='text-[22px] font-[600] text-c-text'>{t('create_project_role')}</span>
        </div>

        <div className='flex flex-col gap-4'>
          <InputValidation
            label={t('name')}
            placeholder={t('role_name...')}
            register={register('name', {
              required: {
                value: true,
                message: t('role_name_required')
              }
            })}
            error={errors.name as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />

          <InputValidation
            label={t('description')}
            placeholder={t('description...')}
            register={register('description', {
              required: {
                value: true,
                message: t('description_required')
              }
            })}
            error={errors.description as FieldError}
          />
        </div>
      </>
    </Modal>
  )
}
