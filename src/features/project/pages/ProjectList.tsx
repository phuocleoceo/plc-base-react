import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Icon } from '@iconify/react'
// import CreateProjectModel from './CreateProjectModel'

import { ProjectRow, CreateProject } from '~/features/project/components'
import { ProjectApi } from '~/features/project/apis'
import { SpinningCircle } from '~/common/components'
import { AppContext } from '~/common/contexts'

export default function ProjectList() {
  const { isAuthenticated } = useContext(AppContext)

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => ProjectApi.getProjects(),
    enabled: isAuthenticated
  })

  const projects = data?.data.data

  const [isOpen, setIsOpen] = useState(false)

  if (isLoading)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        {isLoading ? (
          'Fetching your projects 🚀'
        ) : (
          <div className='flex items-center gap-6'>
            <span className='text-base'>Loading project...</span>
            <SpinningCircle />
          </div>
        )}
      </div>
    )

  return (
    <>
      <div className='z-10 h-screen min-h-fit grow overflow-auto bg-c-1 px-10 pb-10 pt-12 text-c-5'>
        <div className='flex min-w-[43rem] justify-between'>
          <span className='text-2xl font-semibold tracking-wide'>Projects</span>
          <button onClick={() => setIsOpen(true)} className='btn'>
            Create Project
          </button>
        </div>
        <div className='mt-8'>
          <div className='relative'>
            <input
              placeholder='Search projects'
              className='w-44 rounded-sm border-2 bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
            />
            <Icon width={20} icon='ant-design:search-outlined' className='absolute top-[6px] left-2 w-[19px]' />
          </div>
        </div>
        <div className='min-w-fit'>
          <div className='mt-4 flex py-1 text-sm font-semibold'>
            <div className='w-8 shrink-0'></div>
            <div className='min-w-[3rem] grow px-2'>Image</div>
            <div className='min-w-[3rem] grow px-2'>Key</div>
            <div className='min-w-[10rem] grow px-2'>Name</div>
            <div className='w-52 shrink-0 px-2'>Leader</div>
          </div>
          {projects ? (
            projects.length !== 0 ? (
              <div className='mt-1 border-t-2 border-c-3'>
                {projects.map((project, i) => (
                  <ProjectRow
                    key={project.id}
                    idx={i}
                    id={project.id}
                    name={project.name}
                    issueKey={project.key}
                    image={project.image}
                    leaderId={project.leaderId}
                    leaderName={project.leaderName}
                    leaderAvatar={project.leaderAvatar}
                  />
                ))}
              </div>
            ) : (
              <div className='mt-[30vh] grid place-items-center text-xl'>You have not created any project yet!! 🚀</div>
            )
          ) : null}
        </div>
      </div>
      {isOpen && <CreateProject onClose={() => setIsOpen(false)} />}
    </>
  )
}
