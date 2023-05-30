import { Icon } from '@iconify/react'
import { useState } from 'react'

import { ProjectStatus } from '~/features/projectStatus/models'
import { DraggableWrapper } from '~/common/components'
import { IssueInBoard } from '~/features/issue/models'

type Props = ProjectStatus & {
  idx: number
  issues?: Array<IssueInBoard>
  isDragDisabled: boolean
}

export default function StatusContainer(props: Props) {
  const { idx, issues, isDragDisabled, id, name } = props

  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleUpdateStatus = async () => {
    setIsEditing((p) => !p)
  }

  return (
    <DraggableWrapper
      className='w-[clamp(16rem,18rem,20rem)]'
      index={idx}
      draggableId={'list-' + id}
      isDragDisabled={isDragDisabled}
    >
      <div className='relative mr-3 bg-c-2 p-3 text-c-5 shadow-list'>
        <div className='mb-4 flex items-center justify-between text-[15px]'>
          <div className='item-center flex'>
            <div className='relative'>
              {isEditing ? (
                <input
                  value={name}
                  //   onChange={(e) => setName(e.target.value)}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  className='w-36 border-[1.5px] bg-c-2 pl-2 text-[15px] outline-none focus:border-chakra-blue'
                />
              ) : (
                <span className='block border-[1.5px] border-transparent pl-2 font-medium'>{name}</span>
              )}
            </div>
            <span className='mx-2 text-gray-500'>|</span>
            <span className='text-c-4 pt-[1px] font-bold'>{issues ? issues.length : 0}</span>
          </div>

          <div className='flex gap-2'>
            {isEditing && (
              <button onClick={() => setIsOpen(true)} title='Delete' className='btn-icon ml-5 hover:bg-c-3'>
                <Icon icon='bx:trash' className='text-red-500' />
              </button>
            )}
            <button onClick={handleUpdateStatus} title={isEditing ? 'Save' : 'Edit'} className='btn-icon hover:bg-c-3'>
              <Icon icon={isEditing ? 'charm:tick' : 'akar-icons:edit'} />
            </button>
          </div>
        </div>
      </div>
    </DraggableWrapper>
  )
}
