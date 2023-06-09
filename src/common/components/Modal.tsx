import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import SpinningCircle from './SpinningCircle'

interface Props {
  isShowing: boolean
  children: JSX.Element
  className?: string
  onClose: () => void
  onSubmit?: () => Promise<void>
  isLoading?: boolean
  isMutating?: boolean
  closeLabel?: string
  submitLabel?: string
  submittingLabel?: string
  submitClassName?: string
  submitDisable?: boolean
}

export default function Modal(props: Props) {
  const {
    isShowing,
    onClose,
    onSubmit,
    isLoading,
    isMutating,
    children,
    className,
    closeLabel,
    submittingLabel,
    submitLabel,
    submitClassName,
    submitDisable
  } = props

  const ModalContent = isLoading ? (
    <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text'>
      <div className='flex items-center gap-6'>
        <SpinningCircle height={50} width={50} />
      </div>
    </div>
  ) : (
    <motion.div
      className={`my-8 w-[90%] rounded-[4px] bg-white p-6 ${className ?? 'max-w-[31rem]'}`}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      {onSubmit && (
        <div className='mt-8 flex justify-end gap-x-3'>
          <button onClick={onClose} className='btn-crystal'>
            {closeLabel}
          </button>
          <button
            onClick={onSubmit}
            disabled={submitDisable}
            className={submitDisable ? `btn-disabled` : `btn ${submitClassName}`}
          >
            {isMutating ? submittingLabel : submitLabel}
          </button>
        </div>
      )}
    </motion.div>
  )

  return isShowing
    ? createPortal(
        <div
          className='fixed top-0 left-0 z-20 grid h-screen w-screen place-items-center overflow-auto bg-[#0d67cc40]'
          role='button'
          tabIndex={0}
          onClick={onClose}
          onKeyDown={(event) => {
            if (event.key === 'Esc') onClose()
          }}
        >
          {ModalContent}
        </div>,
        document.getElementById('portal') as Element
      )
    : null
}
