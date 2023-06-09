import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Icon } from '@iconify/react'
import { useContext } from 'react'
import moment from 'moment'

import { Modal, Item, RichTextInput, LabelWrapper, SelectBox } from '~/common/components'
import { QueryKey, IssueType, IssuePriority } from '~/shared/constants'
import { IssueHelper, LocalStorageHelper } from '~/shared/helpers'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { UpdateIssueRequest } from '~/features/issue/models'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { SelectItem } from '~/shared/types'
import { useShowing } from '~/common/hooks'
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

  const { control, register, handleSubmit } = useForm<FormData>()

  const currentUser = LocalStorageHelper.getUserInfo()

  const { isShowing: isShowingDeleteIssue, toggle: toggleDeleteIssue } = useShowing()

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

  return (
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
            <RichTextInput control={control} controlField='title' defaultValue={issue?.title} />
            <RichTextInput control={control} controlField='description' defaultValue={issue?.description} />
            <hr className='mx-3 my-3' />
          </div>

          <div className='mt-3 shrink-0 sm:w-[15rem]'>
            <LabelWrapper label='reporter' margin='mt-0'>
              <SelectBox
                control={control}
                controlField='reporterId'
                selectList={projectMembers}
                defaultValue={issue?.reporterId.toString()}
                className='w-full'
              />
            </LabelWrapper>

            <LabelWrapper label='assignee' margin='mt-0'>
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

            <LabelWrapper label='type' margin='mt-0'>
              <SelectBox
                control={control}
                controlField='type'
                selectList={IssueType}
                defaultValue={issue?.type}
                className='w-full'
              />
            </LabelWrapper>

            <LabelWrapper label='priority' margin='mt-0'>
              <SelectBox
                control={control}
                controlField='priority'
                selectList={IssuePriority}
                defaultValue={issue?.priority}
                className='w-full'
              />
            </LabelWrapper>

            <hr className='border-t-[.5px] border-gray-400 my-3' />

            <div className='mt-4 text-sm text-gray-700'>
              {issue?.createdAt && <span className='mb-2 block'>created {parseDate(issue?.createdAt)}</span>}
              {issue?.updatedAt && <span>updated {parseDate(issue?.updatedAt)}</span>}
            </div>
          </div>
        </div>
      </>
    </Modal>
  )
}

const parseDate = (s: Date | undefined) => {
  if (!s) return ''
  return moment(s).fromNow()
}
