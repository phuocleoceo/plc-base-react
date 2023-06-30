import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'

import { ProjectApi } from '~/features/project/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function useProjectPermission(projectId: number) {
  const { isAuthenticated } = useContext(AppContext)

  const { data: permissionData, isLoading: isLoadingPermission } = useQuery({
    queryKey: [QueryKey.UserPermissionInProject, projectId],
    queryFn: () => ProjectApi.getUserPermissionInProject(projectId),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })

  const permissions = permissionData?.data.data

  const hasPermission = (key: string) => {
    return permissions?.has(key)
  }

  return {
    permissions,
    isLoadingPermission,
    hasPermission
  }
}
