import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react'

import { ProjectMemberRow, ProjectMemberDetail } from '~/features/projectMember/components'
import { GetMemberForProjectParams } from '~/features/projectMember/models'
import { ProjectMemberApi } from '~/features/projectMember/apis'
import { SpinningCircle } from '~/common/components'
import { AppContext } from '~/common/contexts'
import { useShowing } from '~/common/hooks'

export default function ProjectMemberList() {
  const projectId = Number(useParams().projectId)
  const { isShowing: isShowingMemberDetail, toggle: toggleMemberDetail } = useShowing()
  const navigate = useNavigate()

  const { isAuthenticated } = useContext(AppContext)

  const [projectMemberParams, setProjectMemberParams] = useState<GetMemberForProjectParams>({
    searchValue: '',
    withDeleted: false
  })

  const handleChangeParams = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectMemberParams({
      ...projectMemberParams,
      [event.target.name]: event.target.value
    })
  }

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ['projectMembers', projectId, projectMemberParams],
    queryFn: () => ProjectMemberApi.getMemberForProject(projectId, projectMemberParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 1000
  })

  const projectMembers = projectData?.data.data

  const [selectedMember, setSelectedMember] = useState<number>()
  const handleClickMemberRow = (userId: number) => {
    setSelectedMember(userId)
    toggleMemberDetail()
  }

  if (projectLoading)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-6'>
          <span className='text-base'>🚀 loading_project_members...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 text-c-5'>
        <div className='flex min-w-[43rem] justify-between'>
          <h1 className='text-xl font-semibold tracking-wide'>project_members</h1>
          <button onClick={() => navigate(`/project/${projectId}/invitation`)} className='btn'>
            invitations
          </button>
        </div>
        <div className='mt-8'>
          <div className='relative'>
            <input
              className='w-52 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
              name='searchValue'
              onChange={handleChangeParams}
              value={projectMemberParams.searchValue}
              placeholder='search_project_members'
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-32'></div>
            <div className='w-60'>name</div>
            <div className='w-72'>email</div>
            <div className='flex-grow'>action</div>
          </div>
          {projectMembers && projectMembers.length !== 0 ? (
            <div className='mt-1 border-t-2 border-c-3'>
              {projectMembers.map((projectMember, idx) => (
                <ProjectMemberRow
                  key={idx}
                  idx={idx}
                  id={projectMember.id}
                  name={projectMember.name}
                  email={projectMember.email}
                  avatar={projectMember.avatar}
                  projectMemberId={projectMember.projectMemberId}
                  projectId={projectId}
                  onClick={() => handleClickMemberRow(projectMember.id)}
                />
              ))}
            </div>
          ) : (
            <div className='mt-[30vh] grid place-items-center text-xl'>no_project_members_found 🚀</div>
          )}
        </div>
      </div>
      {selectedMember && (
        <ProjectMemberDetail userId={selectedMember} isShowing={isShowingMemberDetail} onClose={toggleMemberDetail} />
      )}
    </>
  )
}
