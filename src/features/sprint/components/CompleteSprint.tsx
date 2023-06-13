import { toast } from 'react-toastify'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CompleteSprintRequest, Sprint } from '~/features/sprint/models'
import { IssueGroupedInBoard } from '~/features/issue/models'
import { SprintApi } from '~/features/sprint/apis'
import { QueryKey } from '~/shared/constants'
import { LabelWrapper, Modal, SelectBox } from '~/common/components'
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
        toast.success('completed_sprint')
        queryClient.invalidateQueries([QueryKey.Sprint])
        onClose()
      }
    })
  }

  return (
    <Modal
      onSubmit={handleCompleteSprint}
      isMutating={completeSprintMutation.isLoading}
      closeLabel='cancle'
      submittingLabel='completing...'
      submitLabel='complete'
      {...{ isShowing, onClose }}
    >
      <>
        <div className='text-xl font-normal'>complete_sprint: {sprint.title}</div>
        <div className='mt-3 text-sm'>{completedIssues.length} issues_were_done </div>
        <div className='text-sm'>{unCompletedIssues.length} issues_were_incomplete</div>
        <div className='mt-3 text-sm'>select_where_all_the_incomplete_issues_should_be_moved:</div>

        <LabelWrapper label='move_to' margin='mt-3'>
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
