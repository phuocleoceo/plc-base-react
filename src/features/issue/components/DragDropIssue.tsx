import { Avatar, DraggableWrapper } from '~/common/components'
import { IssueInBoard } from '~/features/issue/models'
import { IssueHelper } from '~/shared/helpers'
import { useShowing } from '~/common/hooks'

type Props = {
  idx: number
  isDragDisabled: boolean
  issue: IssueInBoard
}

export default function DragDropIssue(props: Props) {
  const { idx, isDragDisabled, issue } = props

  const { isShowing: isShowingIssueDetail, toggle: toggleIssueDetail } = useShowing()

  return (
    <>
      <DraggableWrapper
        className='hover:bg-c-4 mb-2 w-full rounded-sm bg-c-1 p-2 shadow-issue'
        index={idx}
        draggableId={`issue-${issue.id}`}
        isDragDisabled={isDragDisabled}
      >
        <div onClick={toggleIssueDetail} onKeyDown={toggleIssueDetail} tabIndex={issue.id} role='button'>
          <span className=''>{issue.title}</span>

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
    </>
  )
}
