import { lazy, Suspense, useContext } from 'react'

import { Avatar, CheckBoxButton, DraggableWrapper } from '~/common/components'
import { IssueHelper, LocalStorageHelper } from '~/shared/helpers'
import { useProjectPermission } from '~/features/project/hooks'
import { BoardContext } from '~/features/board/contexts'
import { IssueInBoard } from '~/features/issue/models'
import { IssuePermission } from '~/shared/enums'
import { useToggle } from '~/common/hooks'

const IssueDetail = lazy(() => import('~/features/issue/components/IssueDetail'))

type Props = {
  idx: number
  projectId: number
  issue: IssueInBoard
  isDragDisabled: boolean
}

export default function DragDropIssue(props: Props) {
  const { idx, projectId, isDragDisabled, issue } = props
  const currentUser = LocalStorageHelper.getUserInfo()
  const { hasPermission } = useProjectPermission(projectId)

  const { isShowingMoveIssueSelect, selectedIssues, setSelectedIssues } = useContext(BoardContext)

  const { isShowing: isShowingIssueDetail, toggle: toggleIssueDetail } = useToggle()

  const handleSelectBoxChange = (isChecked: boolean) => {
    if (isChecked) setSelectedIssues([...selectedIssues, issue.id])
    else setSelectedIssues(selectedIssues.filter((id) => id !== issue.id))
  }

  return (
    <>
      <DraggableWrapper
        className='hover:bg-c-4 mb-2 w-full rounded-sm bg-c-1 p-2 shadow-issue'
        index={idx}
        draggableId={`issue-${issue.id}`}
        isDragDisabled={
          isDragDisabled || issue.assigneeId !== currentUser.id || !hasPermission(IssuePermission.UpdateForBoard)
        }
      >
        <div
          onClick={
            isShowingMoveIssueSelect
              ? () => {
                  return
                }
              : hasPermission(IssuePermission.GetOne)
              ? toggleIssueDetail
              : () => {
                  return
                }
          }
          onKeyDown={toggleIssueDetail}
          tabIndex={issue.id}
          role='button'
        >
          <span className='flex items-center'>
            {isShowingMoveIssueSelect && (
              <span className='mr-2'>
                <CheckBoxButton onChange={handleSelectBoxChange} />
              </span>
            )}
            <span>{issue.title}</span>
          </span>

          <div className='mt-[10px] flex items-center justify-between'>
            <div className='mb-1 flex items-center gap-3'>
              <img
                className='h-[18px] w-[18px]'
                src={IssueHelper.getIssueType(issue.type)?.icon}
                alt={IssueHelper.getIssueType(issue.type)?.label}
              />

              <img
                className='h-[18px] w-[18px]'
                src={IssueHelper.getIssuePriority(issue.priority)?.icon}
                alt={IssueHelper.getIssuePriority(issue.priority)?.label}
              />

              <div className='rounded-full border border-transparent bg-gray-100 text-sm w-9 px-[3px] flex items-center justify-center'>
                {issue.storyPoint ?? '-'}
              </div>
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
