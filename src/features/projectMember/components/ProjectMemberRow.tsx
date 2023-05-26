import { useNavigate } from 'react-router-dom'

import { Avatar } from '~/common/components'

interface Props {
  idx: number
  id: number
  email: string
  name: string
  avatar: string
  projectMemberId: number
}

export default function ProjectMemberRow(props: Props) {
  const { idx, id, name, email, avatar } = props

  const navigate = useNavigate()

  return (
    <div
      key={id}
      className='group relative flex cursor-pointer border-y-2 border-c-3 border-t-transparent py-1 hover:border-t-2 hover:border-blue-400'
      onClick={() => navigate(`${id}/board`)}
      onKeyDown={() => navigate(`${id}/board`)}
      tabIndex={id}
      role='button'
    >
      <div className='w-32 text-center'>{idx + 1}</div>
      <div className='w-60 flex'>
        <Avatar title={name} src={avatar} name={name} className='h-9 w-9 border-[1px] hover:border-green-500' />
        <span className='ml-3'>{name}</span>
      </div>
      <div className='w-72'>{email}</div>
      <div className='flex-grow flex'>
        <div>delete</div>
      </div>
    </div>
  )
}
