import { useQuery, useQueryClient } from '@tanstack/react-query'
import { memo, useContext, useState } from 'react'

import { GetIssueCommentsParams } from '~/features/issue/models'
import { IssueCommentApi } from '~/features/issue/apis'
import { SpinningCircle } from '~/common/components'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import CommentRow from './CommentRow'

interface Props {
  issueId: number
}

function IssueComment(props: Props) {
  const { issueId } = props

  const { isAuthenticated } = useContext(AppContext)
  const queryClient = useQueryClient()

  const [commentParams, setCommentParams] = useState<GetIssueCommentsParams>({
    pageNumber: 1,
    pageSize: 5,
    searchValue: ''
  })

  const { data: commentData, isLoading: isLoadingComment } = useQuery({
    queryKey: [QueryKey.IssueComment, issueId, commentParams],
    queryFn: () => IssueCommentApi.getCommentsForIssue(issueId, commentParams),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000
  })

  const comments = commentData?.data.data.records || []
  const commentCount = commentData?.data.data.totalRecords ?? 0

  return (
    <div className='max-w-[35rem] py-3 text-c-text sm:mx-3'>
      <span className='tracking-wide font-medium'>comments</span>
      <ul className='mt-6'>
        {comments.length > 0 ? (
          comments.map((comment) => <CommentRow key={comment.id} {...{ comment }} />)
        ) : (
          <div className='z-10 grid w-full place-items-center bg-c-1 text-c-text'>no_comment 🚀</div>
        )}
      </ul>
    </div>
  )
}

export default memo(IssueComment)
