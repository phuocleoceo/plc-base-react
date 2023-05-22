import { useNavigate } from 'react-router-dom'

import { LocalStorageHelper } from '~/shared/helpers'
import { Avatar } from '~/common/components'

interface Props {
  idx: number
  id: number
  name: string
  issueKey: string
  image: string
  leaderId: number
  leaderName: string
  leaderAvatar: string
}

export default function ProjectRow(props: Props) {
  const { idx, id, name, issueKey, image, leaderId, leaderName, leaderAvatar } = props

  const navigate = useNavigate()
  const currentUser = LocalStorageHelper.getUserInfo()

  return (
    <div
      key={id}
      className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
      onClick={() => navigate(`project/${id}/board`)}
      onKeyDown={() => navigate(`project/${id}/board`)}
      tabIndex={id}
      role='button'
    >
      <div className='w-8 shrink-0 text-center'>{idx + 1}</div>
      <div className='min-w-[3rem] grow px-2'>
        <Avatar title='Profile' src={image} name={name} className='h-9 w-9 border-[1px] hover:border-green-500' />
      </div>
      <div className='min-w-[3rem] grow px-2'>{issueKey}</div>
      <div className='min-w-[10rem] grow px-2'>{name}</div>
      <div className='w-52 shrink-0 px-2 flex'>
        <Avatar
          title='Profile'
          src={leaderAvatar}
          name={leaderName}
          className='h-9 w-9 border-[1px] hover:border-green-500'
        />
        <span>{leaderName}</span>
        {currentUser.id === leaderId ? <span className='ml-1 text-sm font-bold'>(you)</span> : ''}
      </div>
    </div>
  )
}
