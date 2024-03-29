import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { lazy, Suspense } from 'react'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import { LocalStorageHelper, TimeHelper, ValidationHelper } from '~/shared/helpers'
import { IssueComment, UpdateIssueCommentRequest } from '~/features/issue/models'
import { Avatar, RichTextInput } from '~/common/components'
import { IssueCommentApi } from '~/features/issue/apis'
import { QueryKey } from '~/shared/constants'
import { useToggle } from '~/common/hooks'

const ConfirmModal = lazy(() => import('~/common/components/ConfirmModal'))

interface Props {
  issueId: number
  comment: IssueComment
}

type FormData = Pick<UpdateIssueCommentRequest, 'content'>

export default function CommentRow(props: Props) {
  const { issueId, comment } = props
  const { t } = useTranslation()

  const { isShowing: isShowingUpdateComment, toggle: toggleUpdateComment } = useToggle()
  const { isShowing: isShowingDeleteComment, toggle: toggleDeleteComment } = useToggle()

  const queryClient = useQueryClient()

  const currentUser = LocalStorageHelper.getUserInfo()
  const isCurrentUserComment = currentUser.id === comment.userId

  const {
    control,
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
      toast.warn(t('enter_comment'))
      return
    }

    if (commentData.content === comment.content) {
      toggleUpdateComment()
      return
    }

    updateCommentMutation.mutate(commentData, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKey.IssueComment, issueId])
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
        queryClient.invalidateQueries([QueryKey.IssueComment, issueId])
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
            <span className='font-semibold'>{comment.userName + (isCurrentUserComment ? ` (${t('you')})` : '')}</span>
            <span className='mx-3 text-gray-700'>{TimeHelper.howLongFromNow(comment.createdAt)}</span>
          </div>

          {isShowingUpdateComment ? (
            <RichTextInput control={control} controlField='content' defaultValue={comment.content} />
          ) : (
            <span
              className='text-gray-800 block'
              dangerouslySetInnerHTML={{
                __html: comment.content as TrustedHTML
              }}
            ></span>
          )}

          {isCurrentUserComment &&
            (isShowingUpdateComment ? (
              <>
                <button
                  onClick={handleUpdateComment}
                  className='text-sm tracking-wide text-gray-700 hover:underline mr-2'
                >
                  {updateCommentMutation.isLoading || isSubmitting ? t('saving...') : t('save')}
                </button>

                <button onClick={toggleUpdateComment} className='text-sm tracking-wide text-gray-700 hover:underline'>
                  {t('cancle')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleUpdateComment}
                  className='text-sm tracking-wide text-gray-700 hover:underline mr-2'
                >
                  {t('edit')}
                </button>

                <button onClick={toggleDeleteComment} className='text-sm tracking-wide text-gray-700 hover:underline'>
                  {t('delete')}
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
            confirmMessage={t('submit_delete_comment')}
            closeLabel={t('cancle')}
            submittingLabel={t('deleting_comment...')}
            submitLabel={t('delete_comment')}
            submitClassName='btn-alert'
            className='max-w-[20rem]'
          />
        </Suspense>
      )}
    </>
  )
}
