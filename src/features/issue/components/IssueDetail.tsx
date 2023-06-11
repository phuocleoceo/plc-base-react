import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { lazy, Suspense, useContext } from 'react'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'
import { AxiosError } from 'axios'

import { Modal, Item, RichTextInput, LabelWrapper, SelectBox, InputValidation } from '~/common/components'
import { IssueHelper, LocalStorageHelper, TimeHelper, ValidationHelper } from '~/shared/helpers'
import { QueryKey, IssueType, IssuePriority } from '~/shared/constants'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { UpdateIssueRequest } from '~/features/issue/models'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { SelectItem } from '~/shared/types'
import { useToggle } from '~/common/hooks'
import IssueComment from './IssueComment'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

const MAX_LENGHT_DESCRIPTION = 300

interface Props {
  projectId: number
  issueId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<
  UpdateIssueRequest,
  'title' | 'description' | 'storyPoint' | 'priority' | 'type' | 'reporterId' | 'assigneeId'
>

export default function IssueDetail(props: Props) {
  const { projectId, issueId, isShowing, onClose } = props

  const {
    control,
    setError,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const currentUser = LocalStorageHelper.getUserInfo()

  const { isShowing: isShowingUpdateIssue, toggle: toggleUpdateIssue } = useToggle()
  const { isShowing: isShowingDeleteIssue, toggle: toggleDeleteIssue } = useToggle()
  const { isShowing: isShowingFullDescription, toggle: toggleFullDescription } = useToggle()

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

  const { data: issueData, isLoading: isLoadingIssue } = useQuery({
    queryKey: [QueryKey.IssueDetail, projectId, issueId],
    queryFn: () => IssueApi.getIssueDetail(projectId, issueId),
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000
  })

  const issue = issueData?.data.data

  const updateIssueMutation = useMutation({
    mutationFn: (body: UpdateIssueRequest) => IssueApi.updateIssue(projectId, issueId, body)
  })

  const handleUpdateComment = handleSubmit((form: FormData) => {
    const issueData: UpdateIssueRequest = {
      ...form,
      description: form.description ?? '',
      assigneeId: form.assigneeId?.toString() === 'null' ? null : form.assigneeId
    }

    updateIssueMutation.mutate(issueData, {
      onSuccess: () => {
        toast.success('update_issue_success')
        queryClient.invalidateQueries([QueryKey.IssueDetail])
        queryClient.invalidateQueries([QueryKey.IssueInBoard])
        toggleUpdateIssue()
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  const deleteIssueMutation = useMutation({
    mutationFn: () => IssueApi.deleteIssue(projectId, issueId)
  })

  const handleDeleteIssue = async () => {
    deleteIssueMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKey.IssueInBoard])
        toggleDeleteIssue()
      }
    })
  }

  return (
    <>
      <Modal isLoading={isLoadingIssue || isLoadingProjectMember} {...{ isShowing, onClose }} className='max-w-[65rem]'>
        <>
          <div className='flex items-center justify-between text-[16px] text-gray-600 sm:px-3'>
            <Item
              size='h-4 w-4'
              text={`Issue-${issue?.id}`}
              icon={IssueHelper.getIssuePriority(issue?.priority || '')?.icon}
            />

            <div className='text-black'>
              {currentUser.id === issue?.reporterId &&
                (isShowingUpdateIssue ? (
                  <>
                    <button onClick={handleUpdateComment} title='update' className='btn-icon text-xl mr-2'>
                      <Icon width={24} icon='mi:save' className='text-blue-500' />
                    </button>

                    <button onClick={toggleUpdateIssue} title='cancle' className='btn-icon text-xl mr-2'>
                      <Icon width={24} icon='carbon:unsaved' className='text-red-500' />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={toggleUpdateIssue} title='update' className='btn-icon text-xl mr-2'>
                      <Icon width={24} icon='ic:baseline-edit' className='text-blue-500' />
                    </button>

                    <button onClick={toggleDeleteIssue} title='delete' className='btn-icon text-xl mr-2'>
                      <Icon width={24} icon='bx:trash' className='text-red-500' />
                    </button>
                  </>
                ))}
              <button onClick={onClose} title='Close' className='btn-icon text-lg'>
                <Icon width={22} icon='akar-icons:cross' />
              </button>
            </div>
          </div>

          <div className='sm:flex md:gap-3 pl-3'>
            <div className='w-full sm:pr-6'>
              {isShowingUpdateIssue ? (
                <>
                  <div className='mt-3'>
                    <InputValidation
                      label='title'
                      placeholder='issue_title...'
                      register={register('title', {
                        required: {
                          value: true,
                          message: 'title_required'
                        }
                      })}
                      error={errors.title as FieldError}
                      defaultValue={issue?.title}
                    />
                  </div>

                  <LabelWrapper label='description' margin='mt-3'>
                    <RichTextInput control={control} controlField='description' defaultValue={issue?.description} />
                  </LabelWrapper>
                </>
              ) : (
                <>
                  <div className='mb-2'>
                    <div className='font-bold text-2xl'>{issue?.title}</div>
                  </div>

                  <div className='mb-4'>
                    <label htmlFor={issue?.description} className='tracking-wide text-base font-bold'>
                      description
                    </label>
                    <div
                      className='text-black mt-3 text-90p'
                      dangerouslySetInnerHTML={{
                        __html: isShowingFullDescription
                          ? (issue?.description as TrustedHTML)
                          : (issue?.description.slice(0, MAX_LENGHT_DESCRIPTION) as TrustedHTML)
                      }}
                    ></div>
                  </div>

                  {issue?.description && issue.description.length > MAX_LENGHT_DESCRIPTION && (
                    <button className='text-blue-500 text-80p' onClick={toggleFullDescription}>
                      {isShowingFullDescription ? 'click_to_show_less...' : 'click_to_show_more...'}
                    </button>
                  )}
                </>
              )}

              <hr className='border-t-[.5px] border-gray-300 mx-3 my-5' />

              {!isShowingUpdateIssue && <IssueComment {...{ issueId }} />}
            </div>

            <div className='mt-3 shrink-0 sm:w-[15rem]'>
              {isShowingUpdateIssue ? (
                <>
                  <InputValidation
                    label='story_point'
                    placeholder='story_point...'
                    register={register('storyPoint', {
                      required: {
                        value: true,
                        message: 'story_point_required'
                      }
                    })}
                    type='number'
                    error={errors.storyPoint as FieldError}
                    defaultValue={issue?.storyPoint.toString()}
                  />

                  <LabelWrapper label='reporter' margin='mt-5'>
                    <SelectBox
                      control={control}
                      controlField='reporterId'
                      selectList={projectMembers}
                      defaultValue={issue?.reporterId.toString()}
                      className='w-full'
                    />
                  </LabelWrapper>

                  <LabelWrapper label='assignee' margin='mt-5'>
                    <SelectBox
                      control={control}
                      controlField='assigneeId'
                      selectList={[
                        {
                          label: 'unassigned',
                          value: 'null',
                          icon: 'https://i.stack.imgur.com/SE2cv.jpg'
                        },
                        ...projectMembers
                      ]}
                      defaultValue={issue?.assigneeId?.toString() || 'null'}
                      className='w-full'
                    />
                  </LabelWrapper>

                  <LabelWrapper label='type' margin='mt-5'>
                    <SelectBox
                      control={control}
                      controlField='type'
                      selectList={IssueType}
                      defaultValue={issue?.type}
                      className='w-full'
                    />
                  </LabelWrapper>

                  <LabelWrapper label='priority' margin='mt-5'>
                    <SelectBox
                      control={control}
                      controlField='priority'
                      selectList={IssuePriority}
                      defaultValue={issue?.priority}
                      className='w-full'
                    />
                  </LabelWrapper>
                </>
              ) : (
                <>
                  <div className='mb-4'>
                    <label htmlFor={issue?.storyPoint.toString()} className='text-sm tracking-wide text-gray-800'>
                      story_point
                    </label>
                    <div className='text-black'>{issue?.storyPoint}</div>
                  </div>

                  <div className='mb-4'>
                    <label htmlFor={issue?.reporterName} className='text-sm tracking-wide text-gray-800'>
                      reporter
                    </label>
                    <Item
                      size='w-4 h-4'
                      variant='SQUARE'
                      icon={issue?.reporterAvatar}
                      text={issue?.reporterName ?? ''}
                    />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor={issue?.assigneeName} className='text-sm tracking-wide text-gray-800'>
                      assignee
                    </label>
                    {issue?.assigneeName ? (
                      <Item size='w-4 h-4' variant='SQUARE' icon={issue?.assigneeAvatar} text={issue?.assigneeName} />
                    ) : (
                      <Item
                        size='w-4 h-4'
                        variant='SQUARE'
                        icon='https://i.stack.imgur.com/SE2cv.jpg'
                        text='unassigned'
                      />
                    )}
                  </div>

                  <div className='mb-4'>
                    <label htmlFor={issue?.type} className='text-sm tracking-wide text-gray-800'>
                      type
                    </label>
                    <Item
                      size='w-4 h-4'
                      variant='SQUARE'
                      icon={IssueType.find((type) => type.value === issue?.type)?.icon}
                      text={issue?.type ?? ''}
                    />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor={issue?.priority} className='text-sm tracking-wide text-gray-800'>
                      priority
                    </label>
                    <Item
                      size='w-4 h-4'
                      variant='SQUARE'
                      icon={IssuePriority.find((priority) => priority.value === issue?.priority)?.icon}
                      text={issue?.priority ?? ''}
                    />
                  </div>
                </>
              )}

              <hr className='border-t-[.5px] border-gray-400 my-5' />

              <div className='mt-4 text-sm text-gray-700'>
                {issue?.createdAt && (
                  <span className='mb-2 block'>created {TimeHelper.howLongFromNow(issue?.createdAt)}</span>
                )}
                {issue?.updatedAt && <span>updated {TimeHelper.howLongFromNow(issue?.updatedAt)}</span>}
              </div>
            </div>
          </div>
        </>
      </Modal>

      {isShowingDeleteIssue && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteIssue}
            onClose={toggleDeleteIssue}
            onSubmit={handleDeleteIssue}
            isMutating={deleteIssueMutation.isLoading}
            confirmMessage='submit_delete_issue'
            closeLabel='cancle'
            submittingLabel='deleting_issue...'
            submitLabel='delete_issue'
            submitClassName='btn-alert'
            className='max-w-[20rem]'
          />
        </Suspense>
      )}
    </>
  )
}
