import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { lazy, Suspense, useContext } from 'react'
import { Icon } from '@iconify/react'

import { Modal, Item, RichTextInput, LabelWrapper, SelectBox, InputValidation } from '~/common/components'
import { IssueHelper, LocalStorageHelper, TimeHelper } from '~/shared/helpers'
import { QueryKey, IssueType, IssuePriority } from '~/shared/constants'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { UpdateIssueRequest } from '~/features/issue/models'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { useToggle } from '~/common/hooks'
import { SelectItem } from '~/shared/types'
import IssueComment from './IssueComment'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

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
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const currentUser = LocalStorageHelper.getUserInfo()

  const { isShowing: isShowingDeleteIssue, toggle: toggleDeleteIssue } = useToggle()

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
    staleTime: 1000
  })

  const issue = issueData?.data.data

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
              {currentUser.id === issue?.reporterId && (
                <button onClick={toggleDeleteIssue} title='Delete' className='btn-icon text-xl'>
                  <Icon icon='bx:trash' className='text-red-500' />
                </button>
              )}
              <button onClick={onClose} title='Close' className='btn-icon ml-4 text-lg'>
                <Icon icon='akar-icons:cross' />
              </button>
            </div>
          </div>

          <div className='sm:flex md:gap-3'>
            <div className='w-full sm:pr-6'>
              <div className='mt-3'>
                <InputValidation
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

              <hr className='border-t-[.5px] border-gray-300 mx-3 my-5' />

              <IssueComment {...{ issueId }} />
            </div>

            <div className='mt-3 shrink-0 sm:w-[15rem]'>
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
