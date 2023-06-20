import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react'

import { ProjectMemberRow } from '~/features/projectMember/components'
import { GetMemberForProjectParams } from '~/features/projectMember/models'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { Pagination, SpinningCircle } from '~/common/components'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'

export default function ProjectMemberList() {
  const projectId = Number(useParams().projectId)
  const navigate = useNavigate()

  const { t } = useTranslation()
  const { isAuthenticated } = useContext(AppContext)

  const [projectMemberParams, setProjectMemberParams] = useState<GetMemberForProjectParams>({
    pageNumber: 1,
    pageSize: 10,
    searchValue: '',
    withDeleted: false
  })

  const handleChangeParams = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectMemberParams({
      ...projectMemberParams,
      [event.target.name]: event.target.value
    })
  }

  const handleChangePage = (newPage: number) => {
    setProjectMemberParams({
      ...projectMemberParams,
      pageNumber: newPage
    })
  }

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: [QueryKey.ProjectMembers, projectId, projectMemberParams],
    queryFn: () => ProjectMemberApi.getMemberForProject(projectId, projectMemberParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1000
  })

  const projectMembers = projectData?.data.data.records
  const projectMemberCount = projectData?.data.data.totalRecords ?? 0

  if (projectLoading)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 {t('loading_project_members')}...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 text-c-5 mt-6'>
        <div className='flex min-w-[43rem] justify-between'>
          <h1 className='text-xl font-semibold tracking-wide'>{t('project_members')}</h1>
          <button onClick={() => navigate(`/project/${projectId}/invitation`)} className='btn'>
            {t('invitations')}
          </button>
        </div>
        <div className='mt-8'>
          <div className='relative'>
            <input
              className='w-52 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={projectMemberParams.searchValue}
              placeholder={t('search_project_members')}
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-24'></div>
            <div className='w-60'>{t('name')}</div>
            <div className='w-64'>{t('email')}</div>
            <div className='w-64'>{t('role')}</div>
            <div className='flex-grow'>{t('action')}</div>
          </div>
          {projectMembers && projectMembers.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {projectMembers.map((projectMember, idx) => (
                <ProjectMemberRow key={idx} idx={idx} projectId={projectId} projectMember={projectMember} />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>{t('no_project_members_found')} 🚀</div>
          )}
        </div>

        <Pagination
          pageSize={projectMemberParams.pageSize}
          totalRecords={projectMemberCount}
          onChangePage={handleChangePage}
        />
      </div>
    </>
  )
}
