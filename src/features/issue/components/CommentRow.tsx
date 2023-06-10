import { useNavigate } from 'react-router-dom'

import { LocalStorageHelper, TimeHelper } from '~/shared/helpers'
import { IssueComment } from '~/features/issue/models'
import { Avatar } from '~/common/components'

interface Props {
  comment: IssueComment
}

export default function CommentRow(props: Props) {
  const { comment } = props

  const navigate = useNavigate()
  const currentUser = LocalStorageHelper.getUserInfo()
  const isCurrentUserComment = currentUser.id === comment.userId

  return (
    <>
      <li className='mb-6 flex items-start gap-3'>
        <Avatar src={comment.userAvatar} name={comment.userName} className='mt-1 h-7 w-7' />
        <div className='grow'>
          <div className='flex justify-between text-sm'>
            <span className='font-semibold'>{comment.userName + (isCurrentUserComment ? ' (you)' : '')}</span>
            <span className='ml-3 text-gray-700'>{TimeHelper.howLongFromNow(comment.createdAt)}</span>
          </div>

          <span className='block text-gray-800'>{comment.content}</span>

          {isCurrentUserComment && (
            <>
              <button className='text-sm tracking-wide text-gray-700 hover:underline mr-2'>Edit</button>

              <button className='text-sm tracking-wide text-gray-700 hover:underline'>Delete</button>
            </>
          )}
        </div>
      </li>
    </>
  )
}
