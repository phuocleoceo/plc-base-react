import { Tooltip } from 'react-tooltip'
import { Icon } from '@iconify/react'

import { Sprint } from '~/features/sprint/models'
import { TimeHelper } from '~/shared/helpers'

interface Props {
  sprint?: Sprint
}

export default function SprintBar(props: Props) {
  const { sprint } = props

  if (!sprint) return null

  return (
    <div className='flex min-w-[43rem] justify-between'>
      <div>
        <h1 className='mb-2 text-xl font-semibold text-c-text'>{sprint?.title}</h1>
        <h1 className='mb-4 text-sm text-gray-600'>{sprint?.goal}</h1>
      </div>

      <div>
        <Icon
          width={17}
          icon='bi:clock'
          className='text-black inline-block mr-3 cursor-pointer'
          data-tooltip-id='sprint_time'
          data-tooltip-offset={10}
          data-tooltip-place='bottom'
        />
        <Tooltip
          id='sprint_time'
          render={() => (
            <div className='text-sm'>
              from_date:
              <br />
              {TimeHelper.format(sprint.fromDate, 'DD/MMM/YY hh:mm A')}
              <br />
              to_date:
              <br />
              {TimeHelper.format(sprint.toDate, 'DD/MMM/YY hh:mm A')}
            </div>
          )}
        />

        <span className='text-sm mr-3'>{TimeHelper.howDayRemainFromNow(sprint.toDate)} days remaining</span>

        <button className='btn-gray'>complete_sprint</button>
      </div>
    </div>
  )
}
