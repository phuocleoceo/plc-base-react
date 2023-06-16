import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, lazy, Suspense, useState } from 'react'
import { useParams } from 'react-router-dom'

import { GetIssuesInBacklogParams, MoveIssueToSprintRequest, UpdateBacklogIssueRequest } from '~/features/issue/models'
import { BacklogContext } from '~/features/backlog/contexts'
import { IssueBacklog } from '~/features/issue/components'
import { FilterBar } from '~/features/board/components'
import { DroppableWrapper } from '~/common/components'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'
import { toast } from 'react-toastify'

const CreateIssue = lazy(() => import('~/features/issue/components/CreateIssue'))
const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

export default function ProjectBacklog() {
  const projectId = Number(useParams().projectId)

  const { isAuthenticated } = useContext(AppContext)

  const {
    selectedIssues,
    setSelectedIssues,
    isShowingMoveIssueModal,
    toggleMoveIssueModal,
    isShowingMoveIssueSelect,
    toggleMoveIssueSelect
  } = useContext(BacklogContext)

  const { isShowing: isShowingCreateIssue, toggle: toggleCreateIssue } = useToggle()

  const [isDragDisabled, setIsDragDisabled] = useState(false)

  const queryClient = useQueryClient()

  const [issueParams, setIssueParams] = useState<GetIssuesInBacklogParams>({
    searchValue: '',
    assignees: ''
  })

  const { data: backlogData } = useQuery({
    queryKey: [QueryKey.IssueInBacklog, projectId, issueParams],
    queryFn: () => IssueApi.getIssuesInBacklog(projectId, issueParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const issuesBacklog = backlogData?.data.data

  const updateBacklogIssueMutation = useMutation({
    mutationFn: (data: { projectId: number; issueId: number; body: UpdateBacklogIssueRequest }) =>
      IssueApi.updateIssuesInBacklog(data.projectId, data.issueId, data.body)
  })

  const moveIssueToSprintMutation = useMutation({
    mutationFn: (body: MoveIssueToSprintRequest) => IssueApi.moveIssueToSprint(projectId, body)
  })

  const handleMoveIssueToSprint = async () => {
    if (selectedIssues.length == 0) {
      toast.warn('select_issue_to_move')
      toggleMoveIssueModal()
      return
    }

    const issues: MoveIssueToSprintRequest = {
      issues: [...selectedIssues]
    }

    moveIssueToSprintMutation.mutate(issues, {
      onSuccess: () => {
        toast.success('move_issue_to_sprint_success')
        queryClient.invalidateQueries([QueryKey.IssueInBacklog])
        queryClient.invalidateQueries([QueryKey.IssueInBoard])
        setSelectedIssues([])
        toggleMoveIssueModal()
        toggleMoveIssueSelect()
      }
    })
  }

  const getNewBacklogIndex = (source: DraggableLocation, destination: DraggableLocation | null) => {
    if (!issuesBacklog || issuesBacklog.length === 0) return

    if (!source || source?.index === undefined) return
    const fromIndex = source?.index
    if (!destination || destination?.index === undefined) return
    const toIndex = destination?.index

    // Drag lên đầu
    if (toIndex === 0) {
      const newBacklogIndex = (issuesBacklog?.at(0)?.backlogIndex ?? 0) - 1
      const currentIssue = issuesBacklog.splice(fromIndex, 1)[0]
      issuesBacklog.unshift(currentIssue)
      return newBacklogIndex
    }

    // Drag về cuối
    if (toIndex === issuesBacklog?.length - 1) {
      const newBacklogIndex = (issuesBacklog?.at(-1)?.backlogIndex ?? 0) + 1
      const currentIssue = issuesBacklog.splice(fromIndex, 1)[0]
      issuesBacklog.push(currentIssue)
      return newBacklogIndex
    }

    // Drag vào giữa 2 element khác
    let firstSegmentIssue = null
    let toSegmentIssue = null

    if (fromIndex < toIndex) {
      firstSegmentIssue = issuesBacklog?.at(toIndex)
      toSegmentIssue = issuesBacklog?.at(toIndex + 1)
    } else {
      firstSegmentIssue = issuesBacklog?.at(toIndex - 1)
      toSegmentIssue = issuesBacklog?.at(toIndex)
    }
    if (firstSegmentIssue?.backlogIndex === undefined || toSegmentIssue?.backlogIndex === undefined) return

    const newBacklogIndex = (firstSegmentIssue?.backlogIndex + toSegmentIssue?.backlogIndex) / 2
    const currentIssue = issuesBacklog.splice(fromIndex, 1)[0]
    issuesBacklog.splice(toIndex, 0, currentIssue)

    return newBacklogIndex
  }

  const handleDragEnd = ({ draggableId, source, destination }: DropResult) => {
    // Không thay đổi vị trí sau khi drop
    if (source.index === destination?.index) return

    const newBacklogIndex = getNewBacklogIndex(source, destination)
    if (newBacklogIndex === undefined) return

    // Id của issue được drag drop
    const dragIssueId = parseInt(draggableId.split('-').at(-1) || '')

    updateBacklogIssueMutation.mutate(
      {
        projectId,
        issueId: dragIssueId,
        body: {
          backlogIndex: newBacklogIndex
        }
      },
      {
        onSuccess: () => queryClient.invalidateQueries([QueryKey.IssueInBacklog])
      }
    )
  }

  return (
    <>
      <div className='mt-6 flex grow flex-col px-8 sm:px-10'>
        <div className='flex min-w-[43rem] justify-between mb-6'>
          <span className='text-xl font-semibold tracking-wide'>backlog</span>
          <div>
            {isShowingMoveIssueSelect ? (
              <>
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
              </>
            ) : (
              <button onClick={toggleMoveIssueSelect} className='btn-gray mr-3'>
                move_to_sprint
              </button>
            )}

            <button onClick={toggleCreateIssue} className='btn'>
              create_issue
            </button>
          </div>
        </div>
        <FilterBar maxMemberDisplay={4} {...{ projectId, setIsDragDisabled, setIssueParams, issueParams }} />

        {issuesBacklog && issuesBacklog?.length > 0 && (
          <div className='mb-5 flex min-w-max grow items-start'>
            <DragDropContext onDragEnd={handleDragEnd}>
              <DroppableWrapper
                type='issueBacklog'
                className='items-start'
                droppableId='backlog-board'
                direction='vertical'
              >
                {issuesBacklog.map((issue, idx) => (
                  <IssueBacklog key={issue.id} {...{ idx, issue, projectId, isDragDisabled }} />
                ))}
              </DroppableWrapper>
            </DragDropContext>
          </div>
        )}
      </div>

      {isShowingCreateIssue && (
        <Suspense>
          <CreateIssue projectId={projectId} isShowing={isShowingCreateIssue} onClose={toggleCreateIssue} />
        </Suspense>
      )}

      {isShowingMoveIssueModal && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingMoveIssueModal}
            onClose={toggleMoveIssueModal}
            onSubmit={handleMoveIssueToSprint}
            isMutating={moveIssueToSprintMutation.isLoading}
            confirmMessage='submit_move_issue_to_sprint'
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
