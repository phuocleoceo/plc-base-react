import { useParams } from 'react-router-dom'
import { useState } from 'react'

import { FilterBar } from '~/features/board/components'

export default function ProjectBoard() {
  const projectId = Number(useParams().projectId)

  const [isDragDisabled, setIsDragDisabled] = useState(false)

  return (
    <div className='mt-6 flex grow flex-col px-8 sm:px-10'>
      <h1 className='mb-4 text-xl font-semibold text-c-text'>kanban_board</h1>
      <FilterBar maxMemberDisplay={4} {...{ projectId, setIsDragDisabled }} />
    </div>
  )
}
