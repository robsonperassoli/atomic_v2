import { gql, useMutation } from '@apollo/client'
import { Dialog } from '@headlessui/react'
import classNames from 'classnames'
import { Field, Form, Formik, useField } from 'formik'
import { object, string, number } from 'yup'
import Modal from '../modal'
import FieldError from '../forms/field_error'

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
  timeSec: number()
    .required('Time is required')
    .min(0, "Time can't be negative"),
})

const StyledTextField = ({ className = '', ...props }) => (
  <Field
    {...props}
    className={classNames(
      'border border-violet-300 font-medium text-slate-800 rounded-lg px-3 py-3 placeholder:italic placeholder:text-slate-500 placeholder:text-sm placeholder:font-medium tracking-wide outline-violet-400',
      className
    )}
  />
)

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

  const onFormSubmit = async ({ content, timeSec }) => {
    const { data } = await createTask({
      variables: { projectId, content, timeSec },
    })

    onTaskCreated(data?.createTask)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <Dialog.Title className="font-black text-2xl text-violet-700 tracking-wider relative py-3 px-4">
        New Task
        <button
          type="button"
          className="appearance-none focus:outline-none absolute top-2 right-2 hover:bg-slate-50 rounded-full w-8 h-8 p-2 flex items-center justify-center"
          onClick={onClose}
        >
          <i className="fas fa-times text-2xl text-violet-700" />
        </button>
      </Dialog.Title>

      <Formik
        initialValues={{
          content: '',
          timeSec: 0,
        }}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, values }) => (
          <Form className="px-4 pb-6 pt-4">
            <div className="flex flex-col">
              <StyledTextField
                as="textarea"
                id="content"
                name="content"
                rows={4}
                placeholder="e.g. Design the task creation flow"
              />
              <FieldError forField="content" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-3 gap-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4">
                <Label htmlFor="timeSec">Time</Label>
                <StyledTextField
                  id="timeSec"
                  name="timeSec"
                  className="max-w-[10rem]"
                />
                <FieldError forField="timeSec" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg font-semibold text-2xl tracking-wide text-white bg-violet-500 px-8 py-2 leading-7 block"
              >
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default CreateTaskModal
