import { gql, useMutation } from '@apollo/client'
import { Duration } from 'luxon'
import { Form, Formik } from 'formik'
import { object, string, number } from 'yup'
import Modal, { ModalHeader } from '../modal'
import FieldError from '../forms/field_error'
import Button from '../button'
import FormField from '../forms/form_field'
import TaskTime from '../task_time'

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($projectId: ID!, $content: String!, $timeSec: Int!) {
    createTask(projectId: $projectId, content: $content, timeSec: $timeSec) {
      id
      content
      timeSec
    }
  }
`

const validationSchema = object().shape({
  content: string().required('Task Content is required').min(10),
  timeMin: number()
    .required('Time is required')
    .min(0, "Time can't be negative"),
})

const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="text-slate-800 font-medium pb-1">
      {children}
    </label>
  )
}

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

      <Formik
        initialValues={{
          content: '',
          timeMin: 0,
        }}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, values }) => (
          <Form className="px-4 pb-6 pt-4">
            <div className="flex flex-col">
              <FormField
                as="textarea"
                id="content"
                name="content"
                rows={4}
                placeholder="e.g. Design the task creation flow"
              />
              <FieldError forField="content" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-3 gap-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center gap-x-4">
                  <Label htmlFor="timeMin">
                    Time <small className="text-slate-400">(min)</small>
                  </Label>
                  <FormField
                    id="timeMin"
                    name="timeMin"
                    className="max-w-[10rem]"
                  />

                  {values.timeMin > 0 && (
                    <TaskTime
                      timeInSec={Duration.fromObject({
                        minutes: values.timeMin,
                      }).as('seconds')}
                    />
                  )}
                </div>

                <FieldError forField="timeSec" />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default CreateTaskModal
