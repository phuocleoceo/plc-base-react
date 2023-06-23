import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { DateTimePicker, InputValidation, LabelWrapper, Modal, RichTextInput } from '~/common/components'
import { CreateEventRequest } from '~/features/event/models'
import { ValidationHelper } from '~/shared/helpers'
import { EventApi } from '~/features/event/apis'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreateEventRequest, 'title' | 'description' | 'startTime' | 'endTime' | 'attendeeIds'>

export default function CreateEvent(props: Props) {
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

  const createEventMutation = useMutation({
    mutationFn: (body: CreateEventRequest) => EventApi.createEvent(projectId, body)
  })

  const handleCreateEvent = handleSubmit((form: FormData) => {
    const eventData: CreateEventRequest = {
      ...form,
      description: form.description ?? '',
      attendeeIds: [1]
    }

    createEventMutation.mutate(eventData, {
      onSuccess: () => {
        toast.success(t('create_event_success'))
        queryClient.invalidateQueries([QueryKey.EventSchedule])
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
      onSubmit={handleCreateEvent}
      isMutating={createEventMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('creating_event...')}
      submitLabel={t('create_event')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-3'>
          <span className='text-[22px] font-[600] text-c-text'>{t('create_event')}</span>
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

          <LabelWrapper label={t('description')} margin='mt-0'>
            <RichTextInput control={control} controlField='description' />
          </LabelWrapper>

          <LabelWrapper label={t('start_time')} margin='mt-0'>
            <DateTimePicker control={control} controlField='startTime' required={true} className='w-full' />
          </LabelWrapper>

          <LabelWrapper label={t('end_time')} margin='mt-0'>
            <DateTimePicker control={control} controlField='endTime' required={true} className='w-full' />
          </LabelWrapper>
        </div>
      </>
    </Modal>
  )
}
