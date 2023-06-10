import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { lazy, Suspense } from 'react'
import { AxiosError } from 'axios'

import { LocalStorageHelper, TimeHelper, ValidationHelper } from '~/shared/helpers'
import { IssueComment, UpdateIssueCommentRequest } from '~/features/issue/models'
import { IssueCommentApi } from '~/features/issue/apis'
import { QueryKey } from '~/shared/constants'
import { Avatar } from '~/common/components'
import { useToggle } from '~/common/hooks'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  issueId: number
  comment: IssueComment
}

type FormData = Pick<UpdateIssueCommentRequest, 'content'>

export default function CommentRow(props: Props) {
  const { issueId, comment } = props

  const { isShowing: isShowingUpdateComment, toggle: toggleUpdateComment } = useToggle()
  const { isShowing: isShowingDeleteComment, toggle: toggleDeleteComment } = useToggle()

  const queryClient = useQueryClient()

  const currentUser = LocalStorageHelper.getUserInfo()
  const isCurrentUserComment = currentUser.id === comment.userId

  const {
    register,
    setError,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>()

  const updateCommentMutation = useMutation({
    mutationFn: (body: UpdateIssueCommentRequest) => IssueCommentApi.updateIssueComment(issueId, comment.id, body)
  })

  const handleUpdateComment = handleSubmit((form: FormData) => {
    const commentData: UpdateIssueCommentRequest = {
      ...form
    }

    if (!commentData.content) {
      toast.warn('enter_comment')
      return
    }

    if (commentData.content === comment.content) {
      toggleUpdateComment()
      return
    }

    updateCommentMutation.mutate(commentData, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKey.IssueComment])
        toggleUpdateComment()
      },
      onError: (error) => {
        const validateErrors = ValidationHelper.getErrorFromServer(error as AxiosError)
        Object.keys(validateErrors).forEach((key) => {
          setError(key as keyof FormData, validateErrors[key])
        })
      }
    })
  })

  const deleteCommentMutation = useMutation({
    mutationFn: () => IssueCommentApi.deleteIssueComment(issueId, comment.id)
  })

  const handleDeleteComment = async () => {
    deleteCommentMutation.mutate(undefined, {
      onSuccess: () => {
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

          {isShowingUpdateComment ? (
            <input
              placeholder='your_comment...'
              className='max-w-[80%] block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none duration-200 focus:border-chakra-blue 
            bg-slate-100 hover:border-gray-400 border-transparent'
              defaultValue={comment.content}
              {...register('content')}
            />
          ) : (
            <span className='block text-gray-800'>{comment.content}</span>
          )}

          {isCurrentUserComment &&
            (isShowingUpdateComment ? (
              <>
                <button
                  onClick={handleUpdateComment}
                  className='text-sm tracking-wide text-gray-700 hover:underline mr-2'
                >
                  {updateCommentMutation.isLoading || isSubmitting ? 'saving...' : 'save'}
                </button>

                <button onClick={toggleUpdateComment} className='text-sm tracking-wide text-gray-700 hover:underline'>
                  cancle
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleUpdateComment}
                  className='text-sm tracking-wide text-gray-700 hover:underline mr-2'
                >
                  edit
                </button>

                <button onClick={toggleDeleteComment} className='text-sm tracking-wide text-gray-700 hover:underline'>
                  delete
                </button>
              </>
            ))}
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
            className='max-w-[20rem]'
          />
        </Suspense>
      )}
    </>
  )
}
