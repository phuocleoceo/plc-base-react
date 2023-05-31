import { IssueInBoard } from '~/features/issue/models'
import { DraggableWrapper } from '~/common/components'
import { IssueHelper } from '~/shared/helpers'
import { useShowing } from '~/common/hooks'

type Props = IssueInBoard & {
  idx: number
  isDragDisabled: boolean
}

export default function DragDropIssue(props: Props) {
  const { idx, isDragDisabled, id, title, type, priority } = props

  const { isShowing: isShowingIssueDetail, toggle: toggleIssueDetail } = useShowing()

  return (
    <>
      <DraggableWrapper
        className='hover:bg-c-4 mb-2 w-full rounded-sm bg-c-1 p-2 shadow-issue'
        index={idx}
        draggableId={'issue-' + id}
        isDragDisabled={isDragDisabled}
      >
        <div onClick={toggleIssueDetail} onKeyDown={toggleIssueDetail} tabIndex={id} role='button'>
          <span className=''>{title}</span>

          <div className='mt-[10px] flex items-center justify-between'>
            <div className='mb-1 flex items-center gap-3'>
              <img
                className='h-[18px] w-[18px]'
                src={IssueHelper.getIssueType(type)?.icon}
                alt={IssueHelper.getIssueType(type)?.text}
              />

              <img
                className='h-[18px] w-[18px]'
                src={IssueHelper.getIssuePriority(priority)?.icon}
                alt={IssueHelper.getIssuePriority(priority)?.text}
              />
            </div>

            {/* <AssignedMembers assignees={assignees} members={members} /> */}
          </div>
        </div>
      </DraggableWrapper>
    </>
  )
}
