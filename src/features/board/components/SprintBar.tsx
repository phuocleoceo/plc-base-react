import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Tooltip } from 'react-tooltip'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'

import { SprintApi } from '~/features/sprint/apis'
import { CompleteSprintRequest, Sprint } from '~/features/sprint/models'
import { TimeHelper } from '~/shared/helpers'
import { QueryKey } from '~/shared/constants'
import { IssueGroupedInBoard } from '~/features/issue/models'

interface Props {
  completedStatusId?: number
  issues?: IssueGroupedInBoard[]
  projectId: number
  sprint?: Sprint
}

export default function SprintBar(props: Props) {
  const { completedStatusId, issues, projectId, sprint } = props

  const completedIssues =
    issues !== undefined
      ? issues
          .filter(({ projectStatusId }) => projectStatusId === completedStatusId)
          .flatMap(({ issues }) => issues.map((issue) => issue.id))
      : []

  const unCompletedIssues =
    issues !== undefined
      ? issues
          .filter(({ projectStatusId }) => projectStatusId !== completedStatusId)
          .flatMap(({ issues }) => issues.map((issue) => issue.id))
      : []

  const queryClient = useQueryClient()

  const completeSprintMutation = useMutation({
    mutationFn: (body: CompleteSprintRequest) => SprintApi.completeSprint(projectId, sprint?.id ?? -1, body)
  })

  const handleCompleteSprint = async (moveType: string) => {
    const completeSprintData: CompleteSprintRequest = {
      moveType,
      completedIssues,
      unCompletedIssues
    }

    completeSprintMutation.mutate(completeSprintData, {
      onSuccess: () => {
        toast.success('completed_sprint')
        queryClient.invalidateQueries([QueryKey.Sprint])
      }
    })
  }

  if (!sprint) return null

  return (
    <>
      <div className='flex min-w-[43rem] justify-between'>
        <div>
          <h1 className='mb-2 text-xl font-semibold text-c-text'>{sprint?.title}</h1>
          <h1 className='mb-4 text-sm text-gray-600'>{sprint?.goal}</h1>
        </div>

        <div>
          <Icon
            width={17}
            icon='bi:clock'
            className='text-black inline-block mr-3 cursor-pointer'
            data-tooltip-id='sprint_time'
            data-tooltip-offset={10}
            data-tooltip-place='bottom'
            data-tooltip-content={`<div className='text-sm'>
                                  from_date:
                                  <br />
                                  ${TimeHelper.format(sprint.fromDate, 'DD/MMM/YY hh:mm A')}
                                  <br />
                                  to_date:
                                  <br />
                                  ${TimeHelper.format(sprint.toDate, 'DD/MMM/YY hh:mm A')}
                                </div>`}
          />
          <Tooltip
            id='sprint_time'
            render={({ content }) => <div dangerouslySetInnerHTML={{ __html: content as TrustedHTML }} />}
          />

          <span className='text-sm mr-3'>{TimeHelper.howDayRemainFromNow(sprint.toDate)} days remaining</span>

          <button onClick={() => handleCompleteSprint('backlog')} className='btn-gray'>
            complete_sprint
          </button>
        </div>
      </div>
    </>
  )
}
