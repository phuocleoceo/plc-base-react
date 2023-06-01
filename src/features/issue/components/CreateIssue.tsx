import { Modal } from '~/common/components'

interface Props {
  projectId: number
  isShowing: boolean
  onClose: () => void
}

export default function CreateIssue(props: Props) {
  const { projectId, isShowing, onClose } = props

  const handleCreateIssue = async () => {
    console.log('ahihi', projectId)
  }
  const isLoading = false

  return (
    <Modal
      onSubmit={handleCreateIssue}
      closeLabel='cancle'
      submittingLabel='creating_issue...'
      submitLabel='create_issue'
      {...{ isShowing, onClose, isLoading }}
    >
      <>
        <div className='mb-4'>
          <span className='text-[22px] font-[600] text-c-text'>create_issue</span>
        </div>
      </>
    </Modal>
  )
}
