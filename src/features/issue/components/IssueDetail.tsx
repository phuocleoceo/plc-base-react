import { useQuery } from '@tanstack/react-query'

import { Avatar, Modal } from '~/common/components'
import { IssueApi } from '~/features/issue/apis'
import { QueryKey } from '~/shared/constants'

interface Props {
  projectId: number
  issueId: number
  isShowing: boolean
  onClose: () => void
}

export default function IssueDetail(props: Props) {
  const { projectId, issueId, isShowing, onClose } = props

  const { data: issueData, isLoading: isLoadingIssue } = useQuery({
    queryKey: [QueryKey.IssueDetail, projectId, issueId],
    queryFn: () => IssueApi.getIssueDetail(projectId, issueId),
    staleTime: 1000
  })

  const issue = issueData?.data.data

  return (
    <Modal isLoading={isLoadingIssue} {...{ isShowing, onClose }}>
      <p>{issue?.reporterName}</p>
    </Modal>
  )
}
