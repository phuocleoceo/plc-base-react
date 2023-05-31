import { IssueInBoard } from '~/features/issue/models'
import { DraggableWrapper } from '~/common/components'
import { IssueType } from '~/shared/constants'
import { useShowing } from '~/common/hooks'

type Props = IssueInBoard & {
  idx: number
  isDragDisabled: boolean
}

export default function DragDropIssue(props: Props) {
  const { idx, isDragDisabled, id, title, type } = props

  const { isShowing: isShowingIssueDetail, toggle: toggleIssueDetail } = useShowing()

  const getIssueType = (typeValue: string) => {
    return IssueType.find((it) => it.value === typeValue)
  }

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
              <img className='h-[18px] w-[18px]' src={getIssueType(type)?.icon} alt={getIssueType(type)?.text} />
              {/* <img className='h-[18px] w-[18px]' src={icon} alt={text} /> */}
              {/* {comments > 0 && (
                <span className='block w-6 rounded-md bg-c-2 text-center text-[13px]'>
                  {comments}
                </span>
              )} */}
            </div>
            {/* <AssignedMembers assignees={assignees} members={members} /> */}
          </div>
        </div>
      </DraggableWrapper>
    </>
  )
}
