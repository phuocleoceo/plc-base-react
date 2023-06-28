import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'

import { ProjectApi } from '~/features/project/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function useCurrentProject(projectId: number) {
  const { isAuthenticated } = useContext(AppContext)

  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: [QueryKey.ProjectDetail, projectId],
    queryFn: () => ProjectApi.getProjectById(projectId),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })

  const currentProject = projectData?.data.data

  return {
    currentProject,
    isLoadingProject
  }
}
