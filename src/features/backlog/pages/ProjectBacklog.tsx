import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useContext, lazy, Suspense, useState } from 'react'
import { useParams } from 'react-router-dom'

import { GetIssuesInBacklogParams, UpdateBacklogIssueRequest } from '~/features/issue/models'
import { Avatar, DraggableWrapper, DroppableWrapper } from '~/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FilterBar } from '~/features/board/components'
import { IssueApi } from '~/features/issue/apis'
import { IssueHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useShowing } from '~/common/hooks'

const CreateIssue = lazy(() => import('~/features/issue/components/CreateIssue'))

export default function ProjectBacklog() {
  const projectId = Number(useParams().projectId)

  const { isAuthenticated } = useContext(AppContext)
  const { isShowing: isShowingIssueDetail, toggle: toggleIssueDetail } = useShowing()
  const { isShowing: isShowingCreateIssue, toggle: toggleCreateIssue } = useShowing()

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

  const getNewBacklogIndex = (source: DraggableLocation, destination: DraggableLocation | null) => {
    if (!issuesBacklog || issuesBacklog.length === 0) return

    if (!source || source?.index === undefined) return
    const fromIndex = source?.index
    if (!destination || destination?.index === undefined) return
    const toIndex = destination?.index

    if (fromIndex === toIndex) return

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
    const newBacklogIndex = getNewBacklogIndex(source, destination)
    if (newBacklogIndex === undefined) return

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
        onSuccess: () => {
          queryClient.invalidateQueries([QueryKey.IssueInBacklog])
        }
      }
    )
  }

  return (
    <>
      <div className='mt-6 flex grow flex-col px-8 sm:px-10'>
        <div className='flex min-w-[43rem] justify-between mb-6'>
          <span className='text-2xl font-semibold tracking-wide'>backlog</span>
          <button onClick={toggleCreateIssue} className='btn'>
            create_issue
          </button>
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
                  <DraggableWrapper
                    key={issue.id}
                    className='w-[60rem] border-[1px] p-[0.1rem] mb-[0.2px]'
                    index={idx}
                    draggableId={`issue-${issue.id}`}
                    isDragDisabled={isDragDisabled}
                  >
                    <div onClick={toggleIssueDetail} onKeyDown={toggleIssueDetail} tabIndex={issue.id} role='button'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <img
                            className='h-[18px] w-[18px] ml-2'
                            src={IssueHelper.getIssueType(issue.type)?.icon}
                            alt={IssueHelper.getIssueType(issue.type)?.label}
                          />
                          <span className=''>{issue.title}</span>
                        </div>

                        <div className='ml-7 flex'>
                          {issue.assigneeId ? (
                            <Avatar
                              key={issue.assigneeId}
                              src={issue.assigneeAvatar}
                              name={issue.assigneeName}
                              style={{ zIndex: 0 }}
                              className='pointer-events-none -ml-2 h-7 w-7 border-2'
                            />
                          ) : (
                            <div className='h-7 w-7'></div>
                          )}

                          <img
                            className='h-[18px] w-[18px] ml-2 mt-1'
                            src={IssueHelper.getIssuePriority(issue.priority)?.icon}
                            alt={IssueHelper.getIssuePriority(issue.priority)?.label}
                          />

                          <div className='rounded-full border border-transparent bg-gray-100 ml-2 text-sm w-9 px-[3px] flex items-center justify-center'>
                            {issue.storyPoint ?? '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DraggableWrapper>
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
    </>
  )
}
