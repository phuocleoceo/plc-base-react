import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { DateTimePicker, InputValidation, LabelWrapper, Modal } from '~/common/components'
import { TimeHelper, ValidationHelper } from '~/shared/helpers'
import { UpdateSprintRequest } from '~/features/sprint/models'
import { SprintApi } from '~/features/sprint/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectId: number
  sprintId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<UpdateSprintRequest, 'title' | 'goal' | 'fromDate' | 'toDate'>

export default function UpdateSprint(props: Props) {
  const { projectId, sprintId, isShowing, onClose } = props
  const { t } = useTranslation()

  const {
    reset,
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { data: sprintData, isLoading: isLoadingSprint } = useQuery({
    queryKey: [QueryKey.SprintDetail, sprintId],
    queryFn: () => SprintApi.getSprintById(projectId, sprintId),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const sprint = sprintData?.data.data

  const updateSprintMutation = useMutation({
    mutationFn: (body: UpdateSprintRequest) => SprintApi.updateSprint(projectId, sprintId, body)
  })

  const handleUpdateSprint = handleSubmit((form: FormData) => {
    const sprintData: UpdateSprintRequest = {
      ...form
    }

    updateSprintMutation.mutate(sprintData, {
      onSuccess: () => {
        toast.success(t('update_sprint_success'))
        queryClient.invalidateQueries([QueryKey.AvailableSprint])
        queryClient.invalidateQueries([QueryKey.SprintDetail, sprintId])
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
      isLoading={isLoadingSprint}
      onSubmit={handleUpdateSprint}
      isMutating={updateSprintMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('updating_sprint...')}
      submitLabel={t('update_sprint')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-3'>
          <span className='text-[22px] font-[600] text-c-text'>{t('update_sprint')}</span>
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
            defaultValue={sprint?.title}
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
            defaultValue={sprint?.goal}
          />

          <LabelWrapper label={t('from_date')} margin='mt-0'>
            <DateTimePicker
              control={control}
              controlField='fromDate'
              defaultValue={TimeHelper.toLocal(sprint?.fromDate)}
              className='w-full'
            />
          </LabelWrapper>

          <LabelWrapper label={t('to_date')} margin='mt-0'>
            <DateTimePicker
              control={control}
              controlField='toDate'
              defaultValue={TimeHelper.toLocal(sprint?.toDate)}
              className='w-full'
            />
          </LabelWrapper>
        </div>
      </>
    </Modal>
  )
}
