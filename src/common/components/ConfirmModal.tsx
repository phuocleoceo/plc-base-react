import Modal from './Modal'

interface Props {
  confirmMessage?: string
  isShowing: boolean
  onClose: () => void
  onSubmit?: () => Promise<void>
  className?: string
  isMutating?: boolean
  closeLabel?: string
  submitLabel?: string
  submittingLabel?: string
  submitClassName?: string
  submitDisable?: boolean
}

export default function ConfirmModal(props: Props) {
  const { confirmMessage } = props

  return (
    <Modal {...props}>
      <div>
        <label className='text-sm tracking-wide text-gray-800'>{confirmMessage}</label>
      </div>
    </Modal>
  )
}
