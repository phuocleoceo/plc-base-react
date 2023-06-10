import { memo, useContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { GetIssueCommentsParams } from '~/features/issue/models'
import { Pagination, SpinningCircle } from '~/common/components'
import { IssueCommentApi } from '~/features/issue/apis'
import { AppContext } from '~/common/contexts'
import { QueryKey } from '~/shared/constants'
import CreateComment from './CreateComment'
import CommentRow from './CommentRow'

interface Props {
  issueId: number
}

function IssueComment(props: Props) {
  const { issueId } = props

  const { isAuthenticated } = useContext(AppContext)

  const [commentParams, setCommentParams] = useState<GetIssueCommentsParams>({
    pageNumber: 1,
    pageSize: 5,
    searchValue: ''
  })

  const handleChangePage = (newPage: number) => {
    setCommentParams({
      ...commentParams,
      pageNumber: newPage
    })
  }

  const { data: commentData, isLoading: isLoadingComment } = useQuery({
    queryKey: [QueryKey.IssueComment, issueId, commentParams],
    queryFn: () => IssueCommentApi.getCommentsForIssue(issueId, commentParams),
    enabled: isAuthenticated,
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000
  })

  const comments = commentData?.data.data.records || []
  const commentCount = commentData?.data.data.totalRecords ?? 0

  if (isLoadingComment)
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
        <div className='flex items-center gap-2'>
          <span className='text-base mt-4'>🚀 loading_comments...</span>
          <SpinningCircle />
        </div>
      </div>
    )

  return (
    <div className='text-c-text max-h-[350px] overflow-y-auto'>
      <span className='tracking-wide font-medium'>comments</span>
      <CreateComment {...{ issueId }} />

      <ul className='mt-6'>
        {comments.length > 0 ? (
          comments.map((comment) => <CommentRow key={comment.id} {...{ issueId, comment }} />)
        ) : (
          <div className='z-10 grid w-full place-items-center bg-c-1 text-c-text mt-5'></div>
        )}
      </ul>

      <Pagination pageSize={commentParams.pageSize} totalRecords={commentCount} onChangePage={handleChangePage} />
    </div>
  )
}

export default memo(IssueComment)
