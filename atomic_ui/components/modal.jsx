import { Dialog } from '@headlessui/react'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

export const MODAL_POSITION = {
  TOP: 'top',
  MIDDLE: 'middle',
}

const Modal = ({
  isOpen,
  onClose,
  className = '',
  position = MODAL_POSITION.MIDDLE,
  children,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 overflow-y-auto">
        <div
          className={classNames(
            'flex min-h-full justify-center p-4 text-center',
            {
              'items-center': position === MODAL_POSITION.MIDDLE,
              'items-start': position === MODAL_POSITION.TOP,
            }
          )}
        >
          <Dialog.Panel
            className={twMerge(
              'w-full transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all',
              className
            )}
          >
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

const ModalHeader = ({ children, onClose = null }) => (
  <Dialog.Title className="font-black text-2xl text-violet-700 tracking-wider relative py-3 px-4">
    {children}
    {onClose && (
      <button
        type="button"
        className="appearance-none focus:outline-none absolute top-2 right-2 hover:bg-slate-50 rounded-full w-8 h-8 p-2 flex items-center justify-center"
        onClick={onClose}
      >
        <i className="fas fa-times text-2xl text-violet-700" />
      </button>
    )}
  </Dialog.Title>
)

export { ModalHeader }

export default Modal
