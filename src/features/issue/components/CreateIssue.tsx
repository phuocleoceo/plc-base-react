import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { InputValidation, LabelWrapper, Modal, RichTextInput, SelectBox } from '~/common/components'
import { LocalStorageHelper, ValidationHelper } from '~/shared/helpers'
import { QueryKey, IssueType, IssuePriority } from '~/shared/constants'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { CreateIssueRequest } from '~/features/issue/models'
import { SelectItem } from '~/common/components/SelectBox'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'

interface Props {
  projectId: number
  isShowing: boolean
  onClose: () => void
}

type FormData = Pick<CreateIssueRequest, 'title' | 'description' | 'storyPoint' | 'priority' | 'type' | 'assigneeId'>

export default function CreateIssue(props: Props) {
  const { projectId, isShowing, onClose } = props

  const {
    reset,
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting: isLoading }
  } = useForm<FormData>()

  const currentUser = LocalStorageHelper.getUserInfo()
  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { data: projectMemberData } = useQuery({
    queryKey: [QueryKey.ProjectMemberSelect, projectId],
    queryFn: () => ProjectMemberApi.getMemberForSelect(projectId),
    enabled: isAuthenticated,
    staleTime: 1000
  })

  const projectMembers: SelectItem[] =
    projectMemberData?.data.data.map((pm) => ({
      label: pm.name,
      value: pm.id.toString(),
      icon: pm.avatar
    })) || []

  const createIssueMutation = useMutation({
    mutationFn: (body: CreateIssueRequest) => IssueApi.createIssue(projectId, body)
  })

  const handleCreateIssue = handleSubmit(async (form: FormData) => {
    console.log(form)
    // const issueData: CreateIssueRequest = {
    //   ...form
    // }

    // createIssueMutation.mutate(issueData, {
    //   onSuccess: () => {
    //     toast.success('create_issue_success')
    //     queryClient.invalidateQueries([QueryKey.IssueInBacklog])
    //     reset()
    //     onClose()
    //   },
    //   onError: (error) => {
    //     const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
    //     Object.keys(validateErrors).forEach((key) => {
    //       setError(key as keyof FormData, validateErrors[key])
    //     })
    //   }
    // })
  })

  return (
    <Modal
      onSubmit={handleCreateIssue}
      closeLabel='cancle'
      submittingLabel='creating_issue...'
      submitLabel='create_issue'
      {...{ isShowing, onClose, isLoading }}
    >
      <>
        <div className='mb-4'>
          <span className='text-[22px] font-[600] text-c-text'>create_issue</span>
        </div>

        <div className='flex flex-col gap-4'>
          <InputValidation
            label='title'
            placeholder='title...'
            register={register('title', {
              required: {
                value: true,
                message: 'title_required'
              }
            })}
            error={errors.title as FieldError}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />

          <LabelWrapper label='description' margin='mt-1'>
            <RichTextInput />
          </LabelWrapper>

          <InputValidation
            label='story_point'
            placeholder='story_point...'
            register={register('storyPoint', {
              required: {
                value: true,
                message: 'story_point_required'
              }
            })}
            error={errors.storyPoint as FieldError}
          />

          <LabelWrapper label='type' margin='mt-1'>
            <SelectBox
              control={control}
              controlField='type'
              selectList={IssueType}
              defaultValue={'coding_task'}
              className='w-full'
            />
          </LabelWrapper>

          <LabelWrapper label='priority' margin='mt-1'>
            <SelectBox
              control={control}
              controlField='priority'
              selectList={IssuePriority}
              defaultValue={'medium'}
              className='w-full'
            />
          </LabelWrapper>

          <LabelWrapper label='assignee' margin='mt-1'>
            <SelectBox
              control={control}
              controlField='assigneeId'
              selectList={projectMembers}
              defaultValue={currentUser.id.toString()}
              className='w-full'
            />
          </LabelWrapper>
        </div>
      </>
    </Modal>
  )
}
