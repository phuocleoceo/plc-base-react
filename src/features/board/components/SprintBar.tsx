import { Tooltip } from 'react-tooltip'
import { Icon } from '@iconify/react'
import { lazy, Suspense } from 'react'

import { IssueGroupedInBoard } from '~/features/issue/models'
import { DropDownMenu } from '~/common/components'
import { Sprint } from '~/features/sprint/models'
import { TimeHelper } from '~/shared/helpers'
import { useToggle } from '~/common/hooks'

const CompleteSprint = lazy(() => import('~/features/sprint/components/CompleteSprint'))
const UpdateSprint = lazy(() => import('~/features/sprint/components/UpdateSprint'))

interface Props {
  completedStatusId: number
  issues: IssueGroupedInBoard[]
  projectId: number
  sprint?: Sprint
}

export default function SprintBar(props: Props) {
  const { completedStatusId, issues, projectId, sprint } = props

  const { isShowing: isShowingUpdateSprint, toggle: toggleUpdateSprint } = useToggle()
  const { isShowing: isShowingCompleteSprint, toggle: toggleCompleteSprint } = useToggle()

  if (!sprint) return null

  return (
    <>
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
            data-tooltip-content={`<div className='text-sm'>
                                  from_date:
                                  <br />
                                  ${TimeHelper.format(sprint.fromDate, 'DD/MMM/YY hh:mm A')}
                                  <br />
                                  to_date:
                                  <br />
                                  ${TimeHelper.format(sprint.toDate, 'DD/MMM/YY hh:mm A')}
                                </div>`}
          />
          <Tooltip
            id='sprint_time'
            render={({ content }) => <div dangerouslySetInnerHTML={{ __html: content as TrustedHTML }} />}
          />

          {sprint.toDate && (
            <span className='text-sm mr-3'>{TimeHelper.howDayRemainFromNow(sprint.toDate)} days remaining</span>
          )}

          <button onClick={toggleCompleteSprint} className='btn-gray mr-2'>
            complete_sprint
          </button>

          <DropDownMenu
            options={[
              {
                label: 'edit_sprint',
                onClick: toggleUpdateSprint
              }
            ]}
          />
        </div>
      </div>

      {isShowingCompleteSprint && (
        <Suspense>
          <CompleteSprint
            {...{ projectId, sprint, completedStatusId, issues }}
            isShowing={isShowingCompleteSprint}
            onClose={toggleCompleteSprint}
          />
        </Suspense>
      )}

      {isShowingUpdateSprint && (
        <Suspense>
          <UpdateSprint {...{ projectId, sprint }} isShowing={isShowingUpdateSprint} onClose={toggleUpdateSprint} />
        </Suspense>
      )}
    </>
  )
}
