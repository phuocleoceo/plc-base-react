import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'

import { Avatar, DraggableWrapper, DroppableWrapper } from '~/common/components'
import { useQuery } from '@tanstack/react-query'
import { IssueApi } from '~/features/issue/apis'
import { IssueHelper } from '~/shared/helpers'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useShowing } from '~/common/hooks'

export default function ProjectBacklog() {
  const projectId = Number(useParams().projectId)

  const { isAuthenticated } = useContext(AppContext)
  const { isShowing: isShowingIssueDetail, toggle: toggleIssueDetail } = useShowing()

  const { data: backlogData } = useQuery({
    queryKey: [QueryKey.IssueInBacklog, projectId],
    queryFn: () => IssueApi.getIssuesInBacklog(projectId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const issuesBacklog = backlogData?.data.data

  const handleDragEnd = ({ type, source, destination }: DropResult) => {
    console.log(type, source, destination)
  }

  return (
    <div className='mt-6 flex grow flex-col px-8 sm:px-10'>
      <h1 className='mb-4 text-xl font-semibold text-c-text'>backlog</h1>

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
                  isDragDisabled={false}
                >
                  <div onClick={toggleIssueDetail} onKeyDown={toggleIssueDetail} tabIndex={issue.id} role='button'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <img
                          className='h-[18px] w-[18px] ml-2'
                          src={IssueHelper.getIssueType(issue.type)?.icon}
                          alt={IssueHelper.getIssueType(issue.type)?.text}
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
                          alt={IssueHelper.getIssuePriority(issue.priority)?.text}
                        />

                        <div className='ml-2 text-sm rounded-full border border-transparent bg-gray-100 px-[3px] flex items-center'>
                          {issue.projectStatusName}
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
  )
}
