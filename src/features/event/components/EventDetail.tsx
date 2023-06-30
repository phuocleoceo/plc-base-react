import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { lazy, Suspense, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'
import { AxiosError } from 'axios'

import {
  Modal,
  RichTextInput,
  LabelWrapper,
  InputValidation,
  DateTimePicker,
  MultiSelectBox,
  Item
} from '~/common/components'
import { LocalStorageHelper, TimeHelper, ValidationHelper } from '~/shared/helpers'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { useProjectPermission } from '~/features/project/hooks'
import { UpdateEventRequest } from '~/features/event/models'
import { EventApi } from '~/features/event/apis'
import { EventPermission } from '~/shared/enums'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { SelectItem } from '~/shared/types'
import { useToggle } from '~/common/hooks'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  projectId: number
  eventId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<UpdateEventRequest, 'title' | 'description' | 'startTime' | 'endTime' | 'attendeeIds'>

export default function EventDetail(props: Props) {
  const { projectId, eventId, isShowing, onClose } = props
  const { t } = useTranslation()

  const { hasPermission } = useProjectPermission(projectId)

  const {
    control,
    setError,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const currentUser = LocalStorageHelper.getUserInfo()

  const { isShowing: isShowingUpdateEvent, toggle: toggleUpdateEvent } = useToggle()
  const { isShowing: isShowingDeleteEvent, toggle: toggleDeleteEvent } = useToggle()

  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { data: projectMemberData, isLoading: isLoadingProjectMember } = useQuery({
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

  const { data: eventData, isLoading: isLoadingEvent } = useQuery({
    queryKey: [QueryKey.EventDetail, projectId, eventId],
    queryFn: () => EventApi.getEventDetail(projectId, eventId),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const event = eventData?.data.data

  const updateEventMutation = useMutation({
    mutationFn: (body: UpdateEventRequest) => EventApi.updateEvent(projectId, eventId, body)
  })

  const handleUpdateEvent = handleSubmit((form: FormData) => {
    const eventData: UpdateEventRequest = {
      ...form,
      description: form.description ?? '',
      attendeeIds: form.attendeeIds ?? []
    }

    updateEventMutation.mutate(eventData, {
      onSuccess: () => {
        toast.success(t('update_event_success'))
        queryClient.invalidateQueries([QueryKey.EventSchedule])
        queryClient.invalidateQueries([QueryKey.EventDetail, projectId, eventId])
        toggleUpdateEvent()
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  const deleteEventMutation = useMutation({
    mutationFn: () => EventApi.deleteEvent(projectId, eventId)
  })

  const handleDeleteEvent = async () => {
    deleteEventMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('delete_event_success'))
        queryClient.invalidateQueries([QueryKey.EventSchedule])
        toggleDeleteEvent()
        onClose()
      }
    })
  }

  return (
    <>
      <Modal isLoading={isLoadingEvent || isLoadingProjectMember} {...{ isShowing, onClose }} className='max-w-[45rem]'>
        <>
          <div className='flex items-center justify-between text-[16px] text-gray-600 sm:px-3'>
            <div className='mb-3'>
              <span className='text-[22px] font-[600] text-c-text'>
                {isShowingUpdateEvent ? t('update_event') : event?.title}
              </span>
            </div>

            <div className='text-black'>
              {currentUser.id === event?.creatorId &&
                (isShowingUpdateEvent ? (
                  <>
                    <button onClick={handleUpdateEvent} title='update' className='btn-icon text-xl mr-2'>
                      <Icon width={22} icon='mi:save' className='text-blue-500' />
                    </button>

                    <button onClick={toggleUpdateEvent} title='cancle' className='btn-icon text-xl mr-2'>
                      <Icon width={22} icon='carbon:unsaved' className='text-red-500' />
                    </button>
                  </>
                ) : (
                  <>
                    {hasPermission(EventPermission.Update) && (
                      <button onClick={toggleUpdateEvent} title='update' className='btn-icon text-xl mr-2'>
                        <Icon width={22} icon='ic:baseline-edit' className='text-blue-500' />
                      </button>
                    )}

                    {hasPermission(EventPermission.Delete) && (
                      <button onClick={toggleDeleteEvent} title='delete' className='btn-icon text-xl mr-2'>
                        <Icon width={22} icon='bx:trash' className='text-red-500' />
                      </button>
                    )}
                  </>
                ))}
              <button onClick={onClose} title='Close' className='btn-icon text-lg'>
                <Icon width={22} icon='akar-icons:cross' />
              </button>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            {isShowingUpdateEvent ? (
              <>
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
                  defaultValue={event?.title}
                />

                <LabelWrapper label={t('description')} margin='mt-0'>
                  <RichTextInput control={control} controlField='description' defaultValue={event?.description} />
                </LabelWrapper>

                <LabelWrapper label={t('start_time')} margin='mt-0'>
                  <DateTimePicker
                    control={control}
                    controlField='startTime'
                    required={true}
                    className='w-full'
                    defaultValue={TimeHelper.toLocal(event?.startTime)}
                  />
                </LabelWrapper>

                <LabelWrapper label={t('end_time')} margin='mt-0'>
                  <DateTimePicker
                    control={control}
                    controlField='endTime'
                    required={true}
                    className='w-full'
                    defaultValue={TimeHelper.toLocal(event?.endTime)}
                  />
                </LabelWrapper>

                <LabelWrapper label={t('attendees')} margin='mt-0'>
                  <MultiSelectBox
                    control={control}
                    controlField='attendeeIds'
                    selectList={projectMembers}
                    defaultValue={event?.attendees.map((ea) => ea.id.toString())}
                    className='w-full'
                  />
                </LabelWrapper>
              </>
            ) : (
              <div className='sm:flex md:gap-3 pl-3'>
                <div className='w-full sm:pr-6 text-c-text max-h-[35rem] overflow-y-auto'>
                  <div className='mb-4'>
                    <label htmlFor={event?.description} className='tracking-wide text-base font-bold'>
                      {t('description')}
                    </label>
                    {event?.description && (
                      <div
                        className='text-black mt-3 text-90p'
                        dangerouslySetInnerHTML={{
                          __html: event?.description as TrustedHTML
                        }}
                      ></div>
                    )}
                  </div>
                </div>

                <div className='shrink-0 sm:w-[15rem] max-h-[35rem] overflow-y-auto'>
                  <div className='mb-2'>
                    <label
                      htmlFor={event?.startTime.toString()}
                      className='font-bold text-sm tracking-wide text-gray-800'
                    >
                      {t('start_time')}
                    </label>
                    <div className='text-black mt-2'>
                      {TimeHelper.format(event?.startTime, 'DD/MMM/YY hh:mm A') || 'n/a'}
                    </div>
                  </div>

                  <div className='mb-2'>
                    <label
                      htmlFor={event?.endTime.toString()}
                      className='font-bold text-sm tracking-wide text-gray-800'
                    >
                      {t('end_time')}
                    </label>
                    <div className='text-black mt-2'>
                      {TimeHelper.format(event?.endTime, 'DD/MMM/YY hh:mm A') || 'n/a'}
                    </div>
                  </div>

                  <div className='mb-2'>
                    <label
                      htmlFor={event?.attendees.toString()}
                      className='font-bold text-sm tracking-wide text-gray-800'
                    >
                      {t('attendees')}
                    </label>
                    {event?.attendees &&
                      event?.attendees.length > 0 &&
                      event?.attendees.map((attendee) => (
                        <Item
                          key={attendee.id}
                          size='w-6 h-6'
                          variant='SQUARE'
                          icon={attendee.avatar}
                          text={attendee.name ?? ''}
                          className='mt-2'
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      </Modal>

      {isShowingDeleteEvent && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteEvent}
            onClose={toggleDeleteEvent}
            onSubmit={handleDeleteEvent}
            isMutating={deleteEventMutation.isLoading}
            confirmMessage={`${t('submit_delete_event')} ${event?.title}`}
            closeLabel={t('cancle')}
            submittingLabel={t('deleting_event...')}
            submitLabel={t('delete_event')}
            submitClassName='btn-alert'
            className='max-w-[20rem]'
          />
        </Suspense>
      )}
    </>
  )
}
