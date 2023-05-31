import { useContext, useState, lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '@iconify/react'

import { Pagination, SpinningCircle } from '~/common/components'
import { GetProjectsParams } from '~/features/project/models'
import { ProjectRow } from '~/features/project/components'
import { ProjectApi } from '~/features/project/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useShowing } from '~/common/hooks'

const CreateProject = lazy(() => import('~/features/project/components/CreateProject'))

export default function ProjectList() {
  const { isAuthenticated } = useContext(AppContext)
  const { isShowing: isShowingCreateProject, toggle: toggleCreateProject } = useShowing()

  const [projectParams, setProjectParams] = useState<GetProjectsParams>({
    pageNumber: 1,
    pageSize: 10,
    searchValue: ''
  })

  const handleChangeParams = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectParams({
      ...projectParams,
      [event.target.name]: event.target.value
    })
  }

  const handleChangePage = (newPage: number) => {
    setProjectParams({
      ...projectParams,
      pageNumber: newPage
    })
  }

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.Projects, projectParams],
    queryFn: () => ProjectApi.getProjects(projectParams),
    keepPreviousData: true,
    enabled: isAuthenticated
  })

  const projects = data?.data.data.records
  const projectCount = data?.data.data.totalRecords ?? 0

  if (isLoading)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 loading_projects...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 pb-10 pt-12 text-c-5'>
        <div className='flex min-w-[43rem] justify-between'>
          <span className='text-2xl font-semibold tracking-wide'>projects</span>
          <button onClick={toggleCreateProject} className='btn'>
            create_project
          </button>
        </div>
        <div className='mt-8'>
          <div className='relative'>
            <input
              className='w-44 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={projectParams.searchValue}
              placeholder='search_projects'
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-32'></div>
            <div className='w-40'>image</div>
            <div className='w-40'>key</div>
            <div className='w-80'>name</div>
            <div className='flex-grow'>leader</div>
          </div>
          {projects && projects.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {projects.map((project, idx) => (
                <ProjectRow key={idx} idx={idx} project={project} />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>no_projects_found 🚀</div>
          )}
        </div>

        <Pagination pageSize={projectParams.pageSize} totalRecords={projectCount} onChangePage={handleChangePage} />
      </div>
      {isShowingCreateProject && (
        <Suspense>
          <CreateProject isShowing={isShowingCreateProject} onClose={toggleCreateProject} />
        </Suspense>
      )}
    </>
  )
}
