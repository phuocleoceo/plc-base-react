import { useParams } from 'react-router-dom'
import { useContext, useState } from 'react'

import { ProjectStatusApi } from '~/features/projectStatus/apis'
import { FilterBar } from '~/features/board/components'
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

  console.log(getIssuesByStatusId(projectStatuses?.at(1)?.id))

  return (
    <div className='mt-6 flex grow flex-col px-8 sm:px-10'>
      <h1 className='mb-4 text-xl font-semibold text-c-text'>kanban_board</h1>
      <FilterBar maxMemberDisplay={4} {...{ projectId, setIsDragDisabled }} />
    </div>
  )
}
