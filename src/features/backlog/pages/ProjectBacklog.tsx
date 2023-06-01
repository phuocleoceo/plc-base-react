import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'

import { DragDropStatus } from '~/features/projectStatus/components'
import { ProjectStatusApi } from '~/features/projectStatus/apis'
import { GetIssuesInBoardParams } from '~/features/issue/models'
import { DroppableWrapper } from '~/common/components'
import { useQuery } from '@tanstack/react-query'
import { IssueApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function ProjectBacklog() {
  const projectId = Number(useParams().projectId)

  const { isAuthenticated } = useContext(AppContext)
  const [isDragDisabled, setIsDragDisabled] = useState(false)

  // ---------------------Project Status---------------------
  const { data: projectStatusData } = useQuery({
    queryKey: [QueryKey.ProjectStatuses, projectId],
    queryFn: () => ProjectStatusApi.getProjectStatus(projectId),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const projectStatuses = projectStatusData?.data.data

  // ----------------------Issue----------------------------
  const [issueParams, setIssueParams] = useState<GetIssuesInBoardParams>({
    searchValue: '',
    assignees: ''
  })

  const handleChangeIssueParams = (key: string, value: string) => {
    setIssueParams({
      ...issueParams,
      [key]: value
    })
  }

  const { data: issueData } = useQuery({
    queryKey: [QueryKey.IssueInBoard, projectId, issueParams],
    queryFn: () => IssueApi.getIssuesInBoard(projectId, issueParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000
  })

  const issues = issueData?.data.data

  const getIssuesByStatusId = (statusId?: number) => {
    return issues?.find((i) => i.projectStatusId === statusId)?.issues ?? []
  }

  // ----------------------Drag Drop----------------------------
  const handleDragEnd = ({ type, source, destination }: DropResult) => {
    console.log(type, source, destination)
  }

  return <div className='mt-6 flex grow flex-col px-8 sm:px-10'>abc</div>
}
