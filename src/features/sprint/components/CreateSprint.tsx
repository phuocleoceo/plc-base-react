import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { DateTimePicker, InputValidation, LabelWrapper, Modal } from '~/common/components'
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
  const { t } = useTranslation()

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

  const handleCreateSprint = handleSubmit((form: FormData) => {
    const sprintData: CreateSprintRequest = {
      ...form
    }

    createSprintMutation.mutate(sprintData, {
      onSuccess: () => {
        toast.success(t('create_sprint_success'))
        queryClient.invalidateQueries([QueryKey.AvailableSprint])
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
      onSubmit={handleCreateSprint}
      isMutating={createSprintMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('creating_sprint...')}
      submitLabel={t('create_sprint')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-3'>
          <span className='text-[22px] font-[600] text-c-text'>{t('create_sprint')}</span>
        </div>

        <div className='flex flex-col gap-4'>
          <InputValidation
            label={t('title')}
            placeholder={t('title...')}
            register={register('title', {
              required: {
                value: true,
                message: t('title_required')
              }
            })}
            error={errors.title as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />

          <InputValidation
            label={t('goal')}
            placeholder={t('goal...')}
            register={register('goal', {
              required: {
                value: true,
                message: t('goal_required')
              }
            })}
            error={errors.goal as FieldError}
          />

          <LabelWrapper label='from_date' margin='mt-0'>
            <DateTimePicker control={control} controlField='fromDate' className='w-full' />
          </LabelWrapper>

          <LabelWrapper label='to_date' margin='mt-0'>
            <DateTimePicker control={control} controlField='toDate' className='w-full' />
          </LabelWrapper>
        </div>
      </>
    </Modal>
  )
}
