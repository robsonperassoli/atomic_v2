import { useState, useCallback } from 'react'

const CLOSED_MODAL = {
  id: null,
  props: {},
}

const useModal = () => {
  const [modal, setModal] = useState(CLOSED_MODAL)

  const open = useCallback((id, props = {}) => setModal({ id, props }), [])
  const close = useCallback(() => setModal(CLOSED_MODAL), [])
  const isOpen = useCallback((id) => id === modal.id, [modal.id])

  return { open, close, isOpen, props: modal.props }
}

export default useModal
