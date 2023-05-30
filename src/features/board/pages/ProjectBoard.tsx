import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'

import { StatusContainer } from '~/features/projectStatus/components'
import { ProjectStatusApi } from '~/features/projectStatus/apis'
import { FilterBar } from '~/features/board/components'
import { DroppableWrapper } from '~/common/components'
import { useQuery } from '@tanstack/react-query'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function ProjectBoard() {
  const projectId = Number(useParams().projectId)

  const { isAuthenticated } = useContext(AppContext)

  const [isDragDisabled, setIsDragDisabled] = useState(false)

  const { data: projectStatusData } = useQuery({
    queryKey: [QueryKey.ProjectStatuses, projectId],
    queryFn: () => ProjectStatusApi.getProjectStatus(projectId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const projectStatuses = projectStatusData?.data.data

  const { data: issueData } = useQuery({
    queryKey: [QueryKey.IssueInBoard, projectId],
    queryFn: () => IssueApi.getIssuesInBoard(projectId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const issues = issueData?.data.data

  const getIssuesByStatusId = (statusId?: number) => {
    return issues?.find((i) => i.projectStatusId === statusId)?.issues ?? []
  }

  const handleDragEnd = ({ type, source: s, destination: d }: DropResult) => {
    console.log(type)
  }

  return (
    <div className='mt-6 flex grow flex-col px-8 sm:px-10'>
      <h1 className='mb-4 text-xl font-semibold text-c-text'>kanban_board</h1>
      <FilterBar maxMemberDisplay={4} {...{ projectId, setIsDragDisabled }} />

      {projectStatuses && projectStatuses?.length > 0 && (
        <div className='mb-5 flex min-w-max grow items-start'>
          <DragDropContext onDragEnd={handleDragEnd}>
            <DroppableWrapper
              type='projectStatus'
              className='flex items-start'
              droppableId='board-central'
              direction='horizontal'
            >
              {projectStatuses.map((projectStatus, idx) => (
                <StatusContainer
                  key={projectStatus.id}
                  idx={idx}
                  issues={getIssuesByStatusId(projectStatus.id)}
                  isDragDisabled={isDragDisabled}
                  {...projectStatus}
                />
              ))}
            </DroppableWrapper>
          </DragDropContext>
        </div>
      )}
    </div>
  )
}
