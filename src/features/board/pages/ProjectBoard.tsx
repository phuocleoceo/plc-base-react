import { DragDropContext, DraggableLocation, DropResult } from '@hello-pangea/dnd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { lazy, Suspense, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'

import { GetIssuesInBoardParams, UpdateBoardIssueRequest } from '~/features/issue/models'
import { UpdateProjectStatusRequest } from '~/features/projectStatus/models'
import { ProjectStatusPermission, SprintPermission } from '~/shared/enums'
import { DragDropStatus } from '~/features/projectStatus/components'
import { FilterBar, SprintBar } from '~/features/board/components'
import { ProjectStatusApi } from '~/features/projectStatus/apis'
import { useProjectPermission } from '~/features/project/hooks'
import { DroppableWrapper } from '~/common/components'
import { SprintApi } from '~/features/sprint/apis'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'

import SprintIMG from '~/assets/img/sprint.png'

const CreateProjectStatus = lazy(() => import('~/features/projectStatus/components/CreateProjectStatus'))
const CreateSprint = lazy(() => import('~/features/sprint/components/CreateSprint'))

export default function ProjectBoard() {
  const projectId = Number(useParams().projectId)

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const { hasPermission } = useProjectPermission(projectId)

  const [isDragDisabled, setIsDragDisabled] = useState(false)

  const { isShowing: isShowingCreateSprint, toggle: toggleCreateSprint } = useToggle()
  const { isShowing: isShowingCreateStatus, toggle: toggleCreateStatus } = useToggle()

  const queryClient = useQueryClient()

  // Sprint
  const { data: sprintData, isLoading: isLoadingSprint } = useQuery({
    queryKey: [QueryKey.AvailableSprint, projectId],
    queryFn: () => SprintApi.getAvailableSprint(projectId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const sprint = sprintData?.data.data

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
    if (source.index === destination?.index) return

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
        onSuccess: () => queryClient.invalidateQueries([QueryKey.ProjectStatuses])
      }
    )
  }

  // ----------------------Issue----------------------------
  const [issueParams, setIssueParams] = useState<GetIssuesInBoardParams>({
    searchValue: '',
    assignees: ''
  })

  const { data: issueData } = useQuery({
    queryKey: [QueryKey.IssueInBoard, projectId, sprint, issueParams],
    queryFn: () => IssueApi.getIssuesInBoard(projectId, sprint?.id, issueParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const issues = issueData?.data.data

  const updateBoardIssueMutation = useMutation({
    mutationFn: (data: { projectId: number; issueId: number; body: UpdateBoardIssueRequest }) =>
      IssueApi.updateIssuesInBoard(data.projectId, data.issueId, data.body)
  })

  const getNewIssueIndexNotChangeStatus = (dragStatusId: number, dragIssueIndex: number, dropIssueIndex: number) => {
    const issueList = issues?.find((i) => i.projectStatusId === dragStatusId)?.issues
    if (!issueList || issueList.length === 0) return

    // Drag lên đầu
    if (dropIssueIndex === 0) {
      const newIssueIndex = (issueList?.at(0)?.projectStatusIndex ?? 0) - 1
      const currentIssue = issueList.splice(dragIssueIndex, 1)[0]
      issueList.unshift(currentIssue)
      return newIssueIndex
    }

    // Drag về cuối
    if (dropIssueIndex === issueList?.length - 1) {
      const newIssueIndex = (issueList?.at(-1)?.projectStatusIndex ?? 0) + 1
      const currentIssue = issueList.splice(dragIssueIndex, 1)[0]
      issueList.push(currentIssue)
      return newIssueIndex
    }

    // Drag vào giữa 2 element khác
    let firstSegmentIssue = null
    let toSegmentIssue = null

    if (dragIssueIndex < dropIssueIndex) {
      firstSegmentIssue = issueList?.at(dropIssueIndex)
      toSegmentIssue = issueList?.at(dropIssueIndex + 1)
    } else {
      firstSegmentIssue = issueList?.at(dropIssueIndex - 1)
      toSegmentIssue = issueList?.at(dropIssueIndex)
    }
    if (firstSegmentIssue?.projectStatusIndex === undefined || toSegmentIssue?.projectStatusIndex === undefined) return

    const newIssueIndex = (firstSegmentIssue?.projectStatusIndex + toSegmentIssue?.projectStatusIndex) / 2
    const currentIssue = issueList.splice(dragIssueIndex, 1)[0]
    issueList.splice(dropIssueIndex, 0, currentIssue)

    return newIssueIndex
  }

  const getNewIssueIndexHasChangeStatus = (
    dragStatusId: number,
    dragIssueIndex: number,
    dropStatusId: number,
    dropIssueIndex: number
  ) => {
    const dragIssueList = issues?.find((i) => i.projectStatusId === dragStatusId)?.issues
    if (dragIssueList === undefined || dragIssueList.length === 0) return
    const dropIssueList = issues?.find((i) => i.projectStatusId === dropStatusId)?.issues ?? []
    if (dropIssueList === undefined) return

    // Drag lên đầu
    if (dropIssueIndex === 0) {
      const newIssueIndex = (dropIssueList?.at(0)?.projectStatusIndex ?? 1) - 1
      const currentIssue = dragIssueList.splice(dragIssueIndex, 1)[0]
      dropIssueList.unshift(currentIssue)
      return newIssueIndex
    }

    // Drag về cuối
    if (dropIssueIndex === dropIssueList?.length) {
      const newIssueIndex = (dropIssueList?.at(-1)?.projectStatusIndex ?? -1) + 1
      const currentIssue = dragIssueList.splice(dragIssueIndex, 1)[0]
      dropIssueList.push(currentIssue)
      return newIssueIndex
    }

    // Drag vào giữa 2 element khác
    const firstSegmentIssue = dropIssueList?.at(dropIssueIndex - 1)
    const toSegmentIssue = dropIssueList?.at(dropIssueIndex)

    if (firstSegmentIssue?.projectStatusIndex === undefined || toSegmentIssue?.projectStatusIndex === undefined) return

    const newIssueIndex = (firstSegmentIssue?.projectStatusIndex + toSegmentIssue?.projectStatusIndex) / 2
    const currentIssue = dragIssueList.splice(dragIssueIndex, 1)[0]
    dropIssueList.splice(dropIssueIndex, 0, currentIssue)

    return newIssueIndex
  }

  const handleDragDropIssue = ({ draggableId, source, destination }: DropResult) => {
    // Kéo thả issue thả tại chỗ cũ (status cũ và vị trí cũ) -> return
    if (source.droppableId === destination?.droppableId && source.index === destination.index) return

    // Id của issue được kéo thả
    const dragIssueId = parseInt(draggableId.split('-').at(-1) || '')
    // Id của Status hiện tại
    const dragStatusId = parseInt(source.droppableId.split('-').at(-1) || '')
    // Vị trí index mà ta bắt đầu drag issue
    const dragIssueIndex = source.index

    // Id của Status drop issue vào đó
    const dropStatusId = parseInt(destination?.droppableId.split('-').at(-1) || '')
    // Vị trí index mà ta drop issue vào
    const dropIssueIndex = destination?.index

    if (dragIssueIndex === undefined || dropIssueIndex === undefined) return

    const newIssueIndex =
      dragStatusId === dropStatusId
        ? getNewIssueIndexNotChangeStatus(dragStatusId, dragIssueIndex, dropIssueIndex)
        : getNewIssueIndexHasChangeStatus(dragStatusId, dragIssueIndex, dropStatusId, dropIssueIndex)

    if (newIssueIndex === undefined) return

    updateBoardIssueMutation.mutate(
      {
        projectId,
        issueId: dragIssueId,
        body: {
          projectStatusId: dropStatusId,
          projectStatusIndex: newIssueIndex
        }
      },
      {
        onSuccess: () => queryClient.invalidateQueries([QueryKey.IssueInBoard])
      }
    )
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
      default:
        break
    }
  }

  // Status Id for complete sprint
  const completedStatusId = projectStatuses?.reduce((arr, curr) => {
    return curr.index > arr.index ? curr : arr
  }).id

  if (!sprint && !isLoadingSprint)
    return (
      <>
        <div className='mt-6 flex items-center justify-center h-[70%]'>
          <div className='mt-6 flex items-center justify-center w-screen'>
            <div className='p-4 text-center'>
              <img className='mx-auto' width='50%' height='auto' src={SprintIMG} alt='sprint' />
              <h1 className='text-xl'>{t('there_are_no_available_sprints')}</h1>
              {hasPermission(SprintPermission.Create) && (
                <button onClick={toggleCreateSprint} className='btn-gray mt-4'>
                  {t('create_sprint')}
                </button>
              )}
            </div>
          </div>
        </div>

        {isShowingCreateSprint && (
          <Suspense>
            <CreateSprint {...{ projectId }} isShowing={isShowingCreateSprint} onClose={toggleCreateSprint} />
          </Suspense>
        )}
      </>
    )

  return (
    <>
      <div className='mt-6 flex grow flex-col px-8 sm:px-10'>
        <SprintBar
          {...{ projectId }}
          completedStatusId={completedStatusId ?? -1}
          issues={issues ?? []}
          sprint={sprint}
        />

        <FilterBar maxMemberDisplay={4} {...{ projectId, setIsDragDisabled, setIssueParams, issueParams }} />

        {projectStatuses && (
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
                    projectId={projectId}
                    projectStatus={projectStatus}
                    issues={getIssuesByStatusId(projectStatus.id)}
                    isDragDisabled={isDragDisabled}
                  />
                ))}
              </DroppableWrapper>

              {hasPermission(ProjectStatusPermission.Create) && (
                <button
                  className='flex items-center gap-5 rounded-md bg-c-2 py-3 px-5 mr-3 text-c-5 hover:bg-c-6 active:bg-blue-100'
                  onClick={toggleCreateStatus}
                >
                  <Icon icon='ant-design:plus-outlined' /> {t('create_project_status')}
                </button>
              )}
            </DragDropContext>
          </div>
        )}
      </div>

      {isShowingCreateStatus && (
        <Suspense>
          <CreateProjectStatus {...{ projectId }} isShowing={isShowingCreateStatus} onClose={toggleCreateStatus} />
        </Suspense>
      )}
    </>
  )
}
