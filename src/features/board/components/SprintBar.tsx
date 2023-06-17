import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lazy, Suspense, useContext } from 'react'
import { Tooltip } from 'react-tooltip'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react'

import { IssueGroupedInBoard, MoveIssueToBacklogRequest } from '~/features/issue/models'
import { BoardContext } from '~/features/board/contexts'
import { SprintApi } from '~/features/sprint/apis'
import { DropDownMenu } from '~/common/components'
import { Sprint } from '~/features/sprint/models'
import { TimeHelper } from '~/shared/helpers'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'
import { IssueApi } from '~/features/issue/apis'

const CompleteSprint = lazy(() => import('~/features/sprint/components/CompleteSprint'))
const UpdateSprint = lazy(() => import('~/features/sprint/components/UpdateSprint'))
const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  completedStatusId: number
  issues: IssueGroupedInBoard[]
  projectId: number
  sprint?: Sprint
}

export default function SprintBar(props: Props) {
  const { completedStatusId, issues, projectId, sprint } = props

  const {
    selectedIssues,
    setSelectedIssues,
    isShowingMoveIssueSelect,
    toggleMoveIssueSelect,
    isShowingMoveIssueModal,
    toggleMoveIssueModal
  } = useContext(BoardContext)

  const { isShowing: isShowingUpdateSprint, toggle: toggleUpdateSprint } = useToggle()
  const { isShowing: isShowingStartSprint, toggle: toggleStartSprint } = useToggle()
  const { isShowing: isShowingCompleteSprint, toggle: toggleCompleteSprint } = useToggle()

  const queryClient = useQueryClient()

  const startSprintMutation = useMutation({
    mutationFn: () => SprintApi.startSprint(projectId, sprint?.id ?? -1)
  })

  const handleStartSprint = async () => {
    startSprintMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('started_sprint')
        queryClient.invalidateQueries([QueryKey.AvailableSprint])
        toggleStartSprint()
      }
    })
  }

  const moveIssueToBacklogMutation = useMutation({
    mutationFn: (body: MoveIssueToBacklogRequest) => IssueApi.moveIssueToBacklog(projectId, body)
  })

  const handleMoveIssueToBacklog = async () => {
    if (selectedIssues.length == 0) {
      toast.warn('select_issue_to_move')
      toggleMoveIssueModal()
      return
    }

    const issues: MoveIssueToBacklogRequest = {
      issues: [...selectedIssues]
    }
    moveIssueToBacklogMutation.mutate(issues, {
      onSuccess: () => {
        toast.success('move_issue_to_backlog_success')
        queryClient.invalidateQueries([QueryKey.IssueInBoard])
        queryClient.invalidateQueries([QueryKey.IssueInBacklog])
        setSelectedIssues([])
        toggleMoveIssueModal()
        toggleMoveIssueSelect()
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

        {!isShowingMoveIssueSelect && (
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
                                  ${TimeHelper.format(sprint.fromDate, 'DD/MMM/YY hh:mm A') || 'n/a'}
                                  <br />
                                  to_date:
                                  <br />
                                  ${TimeHelper.format(sprint.toDate, 'DD/MMM/YY hh:mm A') || 'n/a'}
                                </div>`}
            />
            <Tooltip
              id='sprint_time'
              className='z-50'
              render={({ content }) => <div dangerouslySetInnerHTML={{ __html: content as TrustedHTML }} />}
            />

            {sprint.toDate && (
              <span className='text-sm mr-3'>{TimeHelper.howDayRemainFromNow(sprint.toDate)} days remaining</span>
            )}

            {!sprint.completedAt &&
              (sprint.startedAt ? (
                <button onClick={toggleCompleteSprint} className='btn-gray mr-2'>
                  complete_sprint
                </button>
              ) : (
                <button onClick={toggleStartSprint} className='btn-gray mr-2'>
                  start_sprint
                </button>
              ))}

            <DropDownMenu
              options={[
                {
                  label: 'edit_sprint',
                  onClick: toggleUpdateSprint
                },
                {
                  label: 'move_issue_to_backlog',
                  onClick: toggleMoveIssueSelect
                }
              ]}
            />
          </div>
        )}

        {isShowingMoveIssueSelect && (
          <div>
            <button
              onClick={() => {
                toggleMoveIssueSelect()
                setSelectedIssues([])
              }}
              className='btn-gray mr-3'
            >
              cancle
            </button>
            <button onClick={toggleMoveIssueModal} className='btn mr-3'>
              move
            </button>
          </div>
        )}
      </div>

      {isShowingCompleteSprint && (
        <Suspense>
          <CompleteSprint
            {...{ projectId, sprint, completedStatusId, issues }}
            isShowing={isShowingCompleteSprint}
            onClose={toggleCompleteSprint}
          />
        </Suspense>
      )}

      {isShowingUpdateSprint && (
        <Suspense>
          <UpdateSprint
            {...{ projectId }}
            sprintId={sprint.id}
            isShowing={isShowingUpdateSprint}
            onClose={toggleUpdateSprint}
          />
        </Suspense>
      )}

      {isShowingStartSprint && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingStartSprint}
            onClose={toggleStartSprint}
            onSubmit={handleStartSprint}
            isMutating={startSprintMutation.isLoading}
            confirmMessage='submit_start_sprint'
            closeLabel='cancle'
            submittingLabel='starting_sprint...'
            submitLabel='start_sprint'
            className='max-w-[20rem]'
          />
        </Suspense>
      )}

      {isShowingMoveIssueModal && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingMoveIssueModal}
            onClose={toggleMoveIssueModal}
            onSubmit={handleMoveIssueToBacklog}
            isMutating={moveIssueToBacklogMutation.isLoading}
            confirmMessage='submit_move_issue_to_backlog'
            closeLabel='cancle'
            submittingLabel='moving...'
            submitLabel='move'
            className='max-w-[20rem]'
          />
        </Suspense>
      )}
    </>
  )
}
