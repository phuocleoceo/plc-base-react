import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FieldError, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useContext } from 'react'

import { InputValidation, LabelWrapper, Modal, RichTextInput, SelectBox } from '~/common/components'
import { QueryKey, IssueType, IssuePriority } from '~/shared/constants'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { CreateIssueRequest } from '~/features/issue/models'
import { ValidationHelper } from '~/shared/helpers'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { SelectItem } from '~/shared/types'

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
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const { data: projectMemberData } = useQuery({
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

  projectMembers.unshift({
    label: 'unassigned',
    value: 'null',
    icon: 'https://i.stack.imgur.com/SE2cv.jpg'
  })

  const createIssueMutation = useMutation({
    mutationFn: (body: CreateIssueRequest) => IssueApi.createIssue(projectId, body)
  })

  const handleCreateIssue = handleSubmit((form: FormData) => {
    const issueData: CreateIssueRequest = {
      ...form,
      description: form.description ?? '',
      assigneeId: form.assigneeId?.toString() === 'null' ? null : form.assigneeId
    }

    createIssueMutation.mutate(issueData, {
      onSuccess: () => {
        toast.success(t('create_issue_success'))
        queryClient.invalidateQueries([QueryKey.IssueInBacklog])
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
      onSubmit={handleCreateIssue}
      isMutating={createIssueMutation.isLoading || isSubmitting}
      closeLabel={t('cancle')}
      submittingLabel={t('creating_issue...')}
      submitLabel={t('create_issue')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='mb-3'>
          <span className='text-[22px] font-[600] text-c-text'>{t('create_issue')}</span>
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

          <InputValidation
            label={t('story_point')}
            placeholder={t('story_point...')}
            register={register('storyPoint', {
              required: {
                value: true,
                message: t('story_point_required')
              }
            })}
            type='number'
            error={errors.storyPoint as FieldError}
          />

          <LabelWrapper label={t('type')} margin='mt-0'>
            <SelectBox
              control={control}
              controlField='type'
              selectList={IssueType}
              defaultValue={'coding_task'}
              className='w-full'
            />
          </LabelWrapper>

          <LabelWrapper label={t('priority')} margin='mt-0'>
            <SelectBox
              control={control}
              controlField='priority'
              selectList={IssuePriority}
              defaultValue={'medium'}
              className='w-full'
            />
          </LabelWrapper>

          <LabelWrapper label={t('assignee')} margin='mt-0'>
            <SelectBox
              control={control}
              controlField='assigneeId'
              selectList={projectMembers}
              defaultValue={'null'}
              className='w-full'
            />
          </LabelWrapper>
        </div>
      </>
    </Modal>
  )
}
