import { useContext, useState, lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'

import { Pagination, SpinningCircle } from '~/common/components'
import { GetProjectsParams } from '~/features/project/models'
import { ProjectRow } from '~/features/project/components'
import { ProjectApi } from '~/features/project/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'

const CreateProject = lazy(() => import('~/features/project/components/CreateProject'))

export default function ProjectList() {
  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const { isShowing: isShowingCreateProject, toggle: toggleCreateProject } = useToggle()

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

  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: [QueryKey.Projects, projectParams],
    queryFn: () => ProjectApi.getProjects(projectParams),
    keepPreviousData: true,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const projects = projectData?.data.data.records
  const projectCount = projectData?.data.data.totalRecords ?? 0

  if (isLoadingProject)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 {t('loading_projects...')}</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 pb-10 pt-12 text-c-5'>
        <div className='flex min-w-[43rem] justify-between'>
          <span className='text-2xl font-semibold tracking-wide'>{t('projects')}</span>
          <button onClick={toggleCreateProject} className='btn'>
            {t('create_project')}
          </button>
        </div>
        <div className='mt-8'>
          <div className='relative'>
            <input
              className='w-44 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={projectParams.searchValue}
              placeholder={t('search_projects')}
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-32'></div>
            <div className='w-40'>{t('image')}</div>
            <div className='w-40'>{t('key')}</div>
            <div className='w-80'>{t('name')}</div>
            <div className='flex-grow'>{t('leader')}</div>
          </div>
          {projects && projects.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {projects.map((project, idx) => (
                <ProjectRow key={idx} idx={idx} project={project} />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>{t('no_projects_found')} 🚀</div>
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
