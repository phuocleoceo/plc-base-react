import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useContext } from 'react'

import { Avatar, BtnWithIcon, SpinningCircle } from '~/common/components'
import { ProjectApi } from '~/features/project/apis'
import { AppContext } from '~/common/contexts'
import { useShowing } from '~/common/hooks'

export default function Menubar() {
  const projectId = Number(useParams().projectId)
  const { isShowing, toggle } = useShowing(true)

  const { isAuthenticated } = useContext(AppContext)

  const { data, isLoading } = useQuery({
    queryKey: ['project'],
    queryFn: () => ProjectApi.getProjectById(projectId),
    enabled: isAuthenticated,
    staleTime: 100
  })

  const project = data?.data.data

  return (
    <motion.div
      initial={{ width: projectId ? 240 : 15 }}
      animate={{ width: projectId && isShowing ? 240 : 15 }}
      transition={{ type: 'tween' }}
      className='relative bg-c-2'
    >
      {projectId &&
        (isLoading ? (
          <div className='flex justify-center'>
            <SpinningCircle height={40} width={40} />
          </div>
        ) : (
          <div className='h-full w-[15rem] bg-c-2 px-4 py-6'>
            <div className='flex'>
              <div className='grid h-10 w-10 shrink-0 place-items-center text-lg'>
                <Avatar
                  title={project?.name}
                  src={project?.image}
                  name={project?.name}
                  className='h-9 w-9 border-[1px] hover:border-green-500'
                />
              </div>

              <div className='ml-2 w-40'>
                <span className='block truncate text-sm font-medium text-c-5'>{project?.name}</span>
                <span className='text-[13px] text-c-text'>project_planning</span>
              </div>
            </div>

            <div className='mt-5 mb-2'>
              <BtnWithIcon to={`/project/${projectId}/board`} icon='bi:kanban' text='kanban_board' />
              <BtnWithIcon to={`/project/${projectId}/member`} icon='mdi:people' text='project_member' />
            </div>
            <hr className='border-t-[.5px] border-gray-400' />
            <div className='mt-2'>
              <BtnWithIcon to={`/project/${projectId}/setting`} icon='clarity:settings-solid' text='project_setting' />
            </div>
          </div>
        ))}

      <button
        title='toggle_project_menubar'
        onClick={toggle}
        className={`border-zinc-text00 group peer absolute -right-[14px] top-8 z-[20] grid h-7 w-7 place-items-center rounded-full border-[1px] bg-c-1 hover:border-secondary hover:bg-secondary ${
          projectId && project ? '' : 'pointer-events-none'
        }`}
      >
        <Icon
          className='text-secondary group-hover:text-white'
          icon={isShowing ? 'fa-solid:angle-left' : 'fa-solid:angle-right'}
        />
      </button>
      <div className='absolute top-0 right-0 h-full w-[2px] bg-c-3 peer-hover:bg-secondary' />
    </motion.div>
  )
}
