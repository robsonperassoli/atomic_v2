import { gql, useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { TASK_STATUSES } from '../../tasks'
import Modal, { ModalHeader } from '../modal'
import TaskForm from './task_form'

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: ID!, $content: String!, $timeSec: Int) {
    updateTask(id: $id, content: $content, timeSec: $timeSec) {
      id
      content
      timeSec
    }
  }
`

const UpdateTaskModal = ({
  isOpen,
  onClose,
  task,
  onTaskUpdated = () => null,
}) => {
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION)

  const onFormSubmit = useCallback(
    async ({ content, timeMin }) => {
      const updateTimeEnabled = task.status !== TASK_STATUSES.RUNNING

      const { data } = await updateTask({
        variables: {
          id: task.id,
          content,
          timeSec: updateTimeEnabled ? timeMin * 60 : null,
        },
      })

      onTaskUpdated(data?.updateTask)
    },
    [task]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <ModalHeader onClose={onClose}>Edit Task</ModalHeader>

      <TaskForm task={task} submitLabel="Update" onSubmit={onFormSubmit} />
    </Modal>
  )
}

export default UpdateTaskModal
