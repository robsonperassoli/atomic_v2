import { gql, useMutation } from '@apollo/client'
import { Dialog } from '@headlessui/react'
import classNames from 'classnames'
import { Field, Form, Formik, useField } from 'formik'
import { object, string } from 'yup'
import Modal from '../modal'
import FieldError from '../forms/field_error'

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($name: String!, $abbreviation: String!) {
    createProject(name: $name, abbreviation: $abbreviation) {
      id
      name
      abbreviation
    }
  }
`

const validationSchema = object().shape({
  name: string().required('Project name is required').min(5),
  abbreviation: string().required('Abbreviation is required').length(7),
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

const CreateProjectModal = ({
  isOpen,
  onClose,
  onProjectCreated = () => null,
}) => {
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION)

  const onFormSubmit = async ({ name, abbreviation }) => {
    const { data } = await createProject({ variables: { name, abbreviation } })

    onProjectCreated(data?.createProject)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <Dialog.Title className="font-black text-2xl text-violet-700 tracking-wider relative py-3 px-4">
        New Project
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
          name: '',
          abbreviation: '',
        }}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, errors }) => (
          <Form className="px-4 pb-6 pt-4">
            <div className="flex flex-col">
              <Label htmlFor="name">Project Name</Label>
              <StyledTextField
                id="name"
                name="name"
                placeholder="e.g. Redesign the App, Build V2 platform"
              />
              <FieldError forField="name" />
            </div>

            <div className="flex flex-col mt-3">
              <Label htmlFor="abbreviation">Abbreviation</Label>
              <StyledTextField
                id="abbreviation"
                name="abbreviation"
                placeholder="e.g. ATM0001"
                className="max-w-[10rem]"
              />
              <FieldError forField="abbreviation" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg font-semibold text-2xl tracking-wide text-white bg-violet-500 px-8 py-2 leading-7 block mx-auto mt-6"
            >
              Save
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default CreateProjectModal
