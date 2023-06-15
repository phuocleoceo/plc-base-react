import { Dispatch, lazy, SetStateAction, Suspense } from 'react'

import { Avatar, CheckBoxButton, DraggableWrapper } from '~/common/components'
import { IssueInBacklog } from '~/features/issue/models'
import { IssueHelper } from '~/shared/helpers'
import { useToggle } from '~/common/hooks'

const IssueDetail = lazy(() => import('~/features/issue/components/IssueDetail'))

type Props = {
  idx: number
  projectId: number
  issue: IssueInBacklog
  isDragDisabled: boolean
  isShowCheckbox?: boolean
  selectedIssues: Array<number>
  setSelectedIssues: Dispatch<SetStateAction<Array<number>>>
}

export default function IssueBacklog(props: Props) {
  const { idx, projectId, issue, isDragDisabled, isShowCheckbox, selectedIssues, setSelectedIssues } = props

  const { isShowing: isShowingIssueDetail, toggle: toggleIssueDetail } = useToggle()

  const handleSelectBoxChange = (isChecked: boolean) => {
    if (isChecked) setSelectedIssues([...selectedIssues, issue.id])
    else setSelectedIssues(selectedIssues.filter((id) => id !== issue.id))
  }

  return (
    <>
      <DraggableWrapper
        key={issue.id}
        className='w-[60rem] border-[1px] p-[0.1rem] mb-[0.2px]'
        index={idx}
        draggableId={`issue-${issue.id}`}
        isDragDisabled={isDragDisabled}
      >
        <div
          onClick={
            isShowCheckbox
              ? () => {
                  return
                }
              : toggleIssueDetail
          }
          onKeyDown={toggleIssueDetail}
          tabIndex={issue.id}
          role='button'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              {isShowCheckbox && (
                <span className='ml-2'>
                  <CheckBoxButton onChange={handleSelectBoxChange} />
                </span>
              )}
              <img
                className='h-[18px] w-[18px] ml-2'
                src={IssueHelper.getIssueType(issue.type)?.icon}
                alt={IssueHelper.getIssueType(issue.type)?.label}
              />
              <span className=''>{issue.title}</span>
            </div>

            <div className='ml-7 flex'>
              {issue.assigneeId ? (
                <Avatar
                  key={issue.assigneeId}
                  src={issue.assigneeAvatar}
                  name={issue.assigneeName}
                  style={{ zIndex: 0 }}
                  className='pointer-events-none -ml-2 h-7 w-7 border-2'
                />
              ) : (
                <div className='h-7 w-7'></div>
              )}

              <img
                className='h-[18px] w-[18px] ml-2 mt-1'
                src={IssueHelper.getIssuePriority(issue.priority)?.icon}
                alt={IssueHelper.getIssuePriority(issue.priority)?.label}
              />

              <div className='rounded-full border border-transparent bg-gray-100 ml-2 text-sm w-9 px-[3px] flex items-center justify-center'>
                {issue.storyPoint ?? '-'}
              </div>
            </div>
          </div>
        </div>
      </DraggableWrapper>

      {isShowingIssueDetail && (
        <Suspense>
          <IssueDetail
            projectId={projectId}
            issueId={issue.id}
            isShowing={isShowingIssueDetail}
            onClose={toggleIssueDetail}
          />
        </Suspense>
      )}
    </>
  )
}
