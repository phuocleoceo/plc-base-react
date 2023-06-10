import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { lazy, Suspense } from 'react'

import { LocalStorageHelper, TimeHelper } from '~/shared/helpers'
import { IssueCommentApi } from '~/features/issue/apis'
import { IssueComment } from '~/features/issue/models'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { useToggle } from '~/common/hooks'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  issueId: number
  comment: IssueComment
}

export default function CommentRow(props: Props) {
  const { issueId, comment } = props

  const { isShowing: isShowingDeleteComment, toggle: toggleDeleteComment } = useToggle()

  const queryClient = useQueryClient()

  const currentUser = LocalStorageHelper.getUserInfo()
  const isCurrentUserComment = currentUser.id === comment.userId

  const deleteCommentMutation = useMutation({
    mutationFn: () => IssueCommentApi.deleteIssueComment(issueId, comment.id)
  })

  const handleDeleteComment = async () => {
    deleteCommentMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('delete_comment_success')
        queryClient.invalidateQueries([QueryKey.IssueComment])
        toggleDeleteComment()
      }
    })
  }

  return (
    <>
      <li className='mb-6 flex items-start gap-3'>
        <Avatar src={comment.userAvatar} name={comment.userName} className='mt-1 h-7 w-7' />
        <div className='grow'>
          <div className='flex justify-between text-sm'>
            <span className='font-semibold'>{comment.userName + (isCurrentUserComment ? ' (you)' : '')}</span>
            <span className='mx-3 text-gray-700'>{TimeHelper.howLongFromNow(comment.createdAt)}</span>
          </div>

          <span className='block text-gray-800'>{comment.content}</span>

          {isCurrentUserComment && (
            <>
              <button className='text-sm tracking-wide text-gray-700 hover:underline mr-2'>Edit</button>

              <button onClick={toggleDeleteComment} className='text-sm tracking-wide text-gray-700 hover:underline'>
                Delete
              </button>
            </>
          )}
        </div>
      </li>

      {isShowingDeleteComment && (
        <Suspense>
          <ConfirmModal
            isShowing={isShowingDeleteComment}
            onClose={toggleDeleteComment}
            onSubmit={handleDeleteComment}
            isMutating={deleteCommentMutation.isLoading}
            confirmMessage='submit_delete_comment'
            closeLabel='cancle'
            submittingLabel='deleting_comment...'
            submitLabel='delete_comment'
            submitClassName='btn-alert'
            className='w-1/4'
          />
        </Suspense>
      )}
    </>
  )
}
