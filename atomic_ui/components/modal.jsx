import { Dialog } from '@headlessui/react'
import classNames from 'classnames'

const Modal = ({ isOpen, onClose, className = '', children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel
            className={classNames(
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

export default Modal
