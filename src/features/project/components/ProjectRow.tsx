import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LocalStorageHelper } from '~/shared/helpers'
import { Project } from '~/features/project/models'
import { Avatar } from '~/common/components'

interface Props {
  idx: number
  project: Project
}

export default function ProjectRow(props: Props) {
  const { idx, project } = props

  const { t } = useTranslation()
  const navigate = useNavigate()
  const currentUser = LocalStorageHelper.getUserInfo()

  return (
    <div
      key={project.id}
      className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
      onClick={() => navigate(`${project.id}/board`)}
      onKeyDown={() => navigate(`${project.id}/board`)}
      tabIndex={project.id}
      role='button'
    >
      <div className='w-32 text-center'>{idx + 1}</div>
      <div className='w-40'>
        <Avatar
          title={project.name}
          src={project.image}
          name={project.name}
          className='h-9 w-9 border-[1px] hover:border-green-500'
        />
      </div>
      <div className='w-40'>{project.key}</div>
      <div className='w-80'>{project.name}</div>
      <div className='flex-grow flex'>
        <Avatar
          title='Profile'
          src={project.leaderAvatar}
          name={project.leaderName}
          className='h-9 w-9 border-[1px] hover:border-green-500'
        />
        <span className='ml-3'>{project.leaderName}</span>
        {currentUser.id === project.leaderId ? <span className='ml-1 font-bold'>({t('you')})</span> : ''}
      </div>
    </div>
  )
}
