import { gql, useMutation } from '@apollo/client'

import Modal, { ModalHeader } from '../modal'
import TaskForm from './task_form'

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($projectId: ID!, $content: String!, $timeSec: Int!) {
    createTask(projectId: $projectId, content: $content, timeSec: $timeSec) {
      id
      content
      timeSec
    }
  }
`

const CreateTaskModal = ({
  isOpen,
  onClose,
  projectId,
  onTaskCreated = () => null,
}) => {
  const [createTask] = useMutation(CREATE_TASK_MUTATION)

  const onFormSubmit = async ({ content, timeMin }) => {
    const { data } = await createTask({
      variables: { projectId, content, timeSec: timeMin * 60 },
    })

    onTaskCreated(data?.createTask)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <ModalHeader onClose={onClose}>New Task</ModalHeader>

      <TaskForm submitLabel="Create" onSubmit={onFormSubmit} />
    </Modal>
  )
}

export default CreateTaskModal
