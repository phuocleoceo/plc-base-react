import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

interface Props {
  isShowing: boolean
  children: JSX.Element
  className?: string
  onClose: () => void
  onSubmit?: () => Promise<void>
  isLoading?: boolean
  closeLabel: string
  submitLabel: string
  submittingLabel: string
}

export default function Modal(props: Props) {
  const { isShowing, onClose, onSubmit, isLoading, children, className, closeLabel, submittingLabel, submitLabel } =
    props

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
          <motion.div
            className={`my-8 w-[90%] rounded-[4px] bg-white p-6 ${className ?? 'max-w-[31rem]'}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            {onSubmit && (
              <div className='mt-8 flex justify-end gap-x-3'>
                <button onClick={onClose} className='rounded-[3px] px-3 py-1 text-c-1 hover:bg-c-3'>
                  {closeLabel}
                </button>
                <button onClick={onSubmit} className='btn'>
                  {isLoading ? submittingLabel : submitLabel}
                </button>
              </div>
            )}
          </motion.div>
        </div>,
        document.getElementById('portal') as Element
      )
    : null
}
