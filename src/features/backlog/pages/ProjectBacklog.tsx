import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useContext, lazy, Suspense, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Avatar, DraggableWrapper, DroppableWrapper } from '~/common/components'
import { GetIssuesInBacklogParams } from '~/features/issue/models'
import { FilterBar } from '~/features/board/components'
import { useQuery } from '@tanstack/react-query'
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

  const handleDragEnd = ({ type, source, destination }: DropResult) => {
    console.log(type, source, destination)
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
                droppableId='board-central'
                direction='horizontal'
              >
                {issuesBacklog.map((issue, idx) => (
                  <DraggableWrapper
                    key={idx}
                    className='w-[60rem] border-[1px] p-[0.1rem] mb-[0.2px]'
                    index={idx}
                    draggableId={`projectStatus-${issue.id}`}
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
