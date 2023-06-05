import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'

import { GetIssuesInBoardParams, UpdateBoardIssueRequest } from '~/features/issue/models'
import { UpdateProjectStatusRequest } from '~/features/projectStatus/models'
import { DragDropStatus } from '~/features/projectStatus/components'
import { ProjectStatusApi } from '~/features/projectStatus/apis'
import { FilterBar } from '~/features/board/components'
import { DroppableWrapper } from '~/common/components'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function ProjectBoard() {
  const projectId = Number(useParams().projectId)

  const { isAuthenticated } = useContext(AppContext)
  const [isDragDisabled, setIsDragDisabled] = useState(false)
  const queryClient = useQueryClient()

  // ---------------------Project Status---------------------
  const { data: projectStatusData } = useQuery({
    queryKey: [QueryKey.ProjectStatuses, projectId],
    queryFn: () => ProjectStatusApi.getProjectStatus(projectId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const projectStatuses = projectStatusData?.data.data

  const updateProjectStatusMutation = useMutation({
    mutationFn: (data: { projectId: number; projectStatusId: number; body: UpdateProjectStatusRequest }) =>
      ProjectStatusApi.updateProjectStatus(data.projectId, data.projectStatusId, data.body)
  })

  const getNewStatusIndex = (source: DraggableLocation, destination: DraggableLocation | null) => {
    if (!projectStatuses || projectStatuses.length === 0) return

    if (!source || source?.index === undefined) return
    const fromIndex = source?.index
    if (!destination || destination?.index === undefined) return
    const toIndex = destination?.index

    if (fromIndex === toIndex) return

    // Drag lên đầu
    if (toIndex === 0) {
      const newBacklogIndex = (projectStatuses?.at(0)?.index ?? 0) - 1
      const currentIssue = projectStatuses.splice(fromIndex, 1)[0]
      projectStatuses.unshift(currentIssue)
      return newBacklogIndex
    }

    // Drag về cuối
    if (toIndex === projectStatuses?.length - 1) {
      const newBacklogIndex = (projectStatuses?.at(-1)?.index ?? 0) + 1
      const currentIssue = projectStatuses.splice(fromIndex, 1)[0]
      projectStatuses.push(currentIssue)
      return newBacklogIndex
    }

    // Drag vào giữa 2 element khác
    let firstSegmentIssue = null
    let toSegmentIssue = null

    if (fromIndex < toIndex) {
      firstSegmentIssue = projectStatuses?.at(toIndex)
      toSegmentIssue = projectStatuses?.at(toIndex + 1)
    } else {
      firstSegmentIssue = projectStatuses?.at(toIndex - 1)
      toSegmentIssue = projectStatuses?.at(toIndex)
    }
    if (firstSegmentIssue?.index === undefined || toSegmentIssue?.index === undefined) return

    const newBacklogIndex = (firstSegmentIssue?.index + toSegmentIssue?.index) / 2
    const currentIssue = projectStatuses.splice(fromIndex, 1)[0]
    projectStatuses.splice(toIndex, 0, currentIssue)

    return newBacklogIndex
  }

  const handleDragDropStatus = ({ draggableId, source, destination }: DropResult) => {
    const newStatusIndex = getNewStatusIndex(source, destination)
    if (newStatusIndex === undefined) return

    const dragStatusId = parseInt(draggableId.split('-').at(-1) || '')
    const currentStatus = projectStatuses?.find((s) => s.id === dragStatusId)

    updateProjectStatusMutation.mutate(
      {
        projectId,
        projectStatusId: dragStatusId,
        body: {
          name: currentStatus?.name ?? '',
          index: newStatusIndex
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([QueryKey.ProjectStatuses])
        }
      }
    )
  }

  // ----------------------Issue----------------------------
  const [issueParams, setIssueParams] = useState<GetIssuesInBoardParams>({
    searchValue: '',
    assignees: ''
  })

  const { data: issueData } = useQuery({
    queryKey: [QueryKey.IssueInBoard, projectId, issueParams],
    queryFn: () => IssueApi.getIssuesInBoard(projectId, issueParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const issues = issueData?.data.data

  const updateBoardIssueMutation = useMutation({
    mutationFn: (data: { projectId: number; issueId: number; body: UpdateBoardIssueRequest }) =>
      IssueApi.updateIssuesInBoard(data.projectId, data.issueId, data.body)
  })

  const handleDragDropIssue = ({ draggableId, source, destination }: DropResult) => {
    console.log(draggableId, source, destination)
  }

  const getIssuesByStatusId = (statusId?: number) => {
    return issues?.find((i) => i.projectStatusId === statusId)?.issues ?? []
  }

  // ----------------------Drag Drop----------------------------
  const handleDragEnd = (dropResult: DropResult) => {
    switch (dropResult.type) {
      case 'projectStatus':
        handleDragDropStatus(dropResult)
        break
      case 'issueBoard':
        handleDragDropIssue(dropResult)
        break
    }
  }

  return (
    <div className='mt-6 flex grow flex-col px-8 sm:px-10'>
      <h1 className='mb-4 text-xl font-semibold text-c-text'>kanban_board</h1>
      <FilterBar maxMemberDisplay={4} {...{ projectId, setIsDragDisabled, setIssueParams, issueParams }} />

      {projectStatuses && projectStatuses?.length > 0 && (
        <div className='mb-5 flex min-w-max grow items-start'>
          <DragDropContext onDragEnd={handleDragEnd}>
            <DroppableWrapper
              type='projectStatus'
              className='flex items-start'
              droppableId='project-board'
              direction='horizontal'
            >
              {projectStatuses.map((projectStatus, idx) => (
                <DragDropStatus
                  key={projectStatus.id}
                  idx={idx}
                  projectStatus={projectStatus}
                  issues={getIssuesByStatusId(projectStatus.id)}
                  isDragDisabled={isDragDisabled}
                />
              ))}
            </DroppableWrapper>
          </DragDropContext>
        </div>
      )}
    </div>
  )
}
