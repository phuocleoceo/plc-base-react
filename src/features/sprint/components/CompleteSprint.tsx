import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { CompleteSprintRequest, Sprint } from '~/features/sprint/models'
import { LabelWrapper, Modal, SelectBox } from '~/common/components'
import { IssueGroupedInBoard } from '~/features/issue/models'
import { SprintApi } from '~/features/sprint/apis'
import { QueryKey } from '~/shared/constants'
import { SelectItem } from '~/shared/types'
import { useState } from 'react'

interface Props {
  completedStatusId?: number
  issues: IssueGroupedInBoard[]
  projectId: number
  sprint: Sprint
  isShowing: boolean
  onClose: () => void
}

export default function CompleteSprint(props: Props) {
  const { completedStatusId, issues, projectId, sprint, isShowing, onClose } = props
  const { t } = useTranslation()

  const moveOptions: SelectItem[] = [
    {
      label: 'backlog',
      value: 'backlog'
    },
    {
      label: 'next_sprint',
      value: 'next_sprint'
    }
  ]
  const [moveType, setMoveType] = useState<string>('next_sprint')

  const completedIssues = issues
    .filter(({ projectStatusId }) => projectStatusId === completedStatusId)
    .flatMap(({ issues }) => issues.map((issue) => issue.id))

  const unCompletedIssues = issues
    .filter(({ projectStatusId }) => projectStatusId !== completedStatusId)
    .flatMap(({ issues }) => issues.map((issue) => issue.id))

  const queryClient = useQueryClient()

  const completeSprintMutation = useMutation({
    mutationFn: (body: CompleteSprintRequest) => SprintApi.completeSprint(projectId, sprint.id, body)
  })

  const handleCompleteSprint = async () => {
    const completeSprintData: CompleteSprintRequest = {
      moveType,
      completedIssues,
      unCompletedIssues
    }

    completeSprintMutation.mutate(completeSprintData, {
      onSuccess: () => {
        toast.success(t('completed_sprint'))
        queryClient.invalidateQueries([QueryKey.AvailableSprint])
        onClose()
      }
    })
  }

  return (
    <Modal
      onSubmit={handleCompleteSprint}
      isMutating={completeSprintMutation.isLoading}
      closeLabel={t('cancle')}
      submittingLabel={t('completing...')}
      submitLabel={t('complete')}
      {...{ isShowing, onClose }}
    >
      <>
        <div className='text-xl font-normal'>
          {t('complete_sprint')}: {sprint.title}
        </div>
        <div className='mt-3 text-sm'>
          <span className='font-bold'>{completedIssues.length}</span> {t('issues_were_done')}
        </div>
        <div className='text-sm'>
          <span className='font-bold'>{unCompletedIssues.length}</span> {t('issues_were_incomplete')}
        </div>
        <div className='mt-3 text-sm'>{t('select_where_all_the_incomplete_issues_should_be_moved')}:</div>

        <LabelWrapper label={t('move_to')} margin='mt-3'>
          <SelectBox
            selectList={moveOptions}
            defaultValue={'next_sprint'}
            className='w-full'
            onSelected={(selectedValue: string | undefined) => {
              if (selectedValue) setMoveType(selectedValue)
            }}
          />
        </LabelWrapper>
      </>
    </Modal>
  )
}
