import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react'

import { GetProjectRolesParams } from '~/features/admin/features/projectRole/models'
import { ProjectRoleRow } from '~/features/admin/features/projectRole/components'
import { ProjectRoleApi } from '~/features/admin/features/projectRole/apis'
import { Pagination, SpinningCircle } from '~/common/components'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function ProjectRoleList() {
  const { isAuthenticated } = useContext(AppContext)

  const [projectRoleParams, setProjectRoleParams] = useState<GetProjectRolesParams>({
    pageNumber: 1,
    pageSize: 10,
    searchValue: ''
  })

  const handleChangeParams = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectRoleParams({
      ...projectRoleParams,
      [event.target.name]: event.target.value
    })
  }

  const handleChangePage = (newPage: number) => {
    setProjectRoleParams({
      ...projectRoleParams,
      pageNumber: newPage
    })
  }

  const { data: projectRoleData, isLoading: isLoadingProjectRole } = useQuery({
    queryKey: [QueryKey.ProjectRoles, projectRoleParams],
    queryFn: () => ProjectRoleApi.getProjectRoles(projectRoleParams),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const projectRoles = projectRoleData?.data.data.records ?? []
  const projectRoleCount = projectRoleData?.data.data.totalRecords ?? 0

  if (isLoadingProjectRole)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 loading_project_roles...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 pb-5 pt-5 text-c-5'>
        <div className='flex min-w-[43rem] justify-between'>
          <span className='text-2xl font-semibold tracking-wide'>project_roles</span>
        </div>
        <div className='mt-3'>
          <div className='relative'>
            <input
              className='w-48 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={projectRoleParams.searchValue}
              placeholder='search_project_roles'
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-32'></div>
            <div className='w-56'>name</div>
            <div className='w-64'>description</div>
            <div className='flex-grow'>action</div>
          </div>
          {projectRoles && projectRoles.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {projectRoles.map((projectRole, idx) => (
                <ProjectRoleRow key={idx} {...{ idx, projectRole }} />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>no_projects_found 🚀</div>
          )}
        </div>

        <Pagination
          pageSize={projectRoleParams.pageSize}
          totalRecords={projectRoleCount}
          onChangePage={handleChangePage}
        />
      </div>
    </>
  )
}
