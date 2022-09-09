import { gql, useMutation } from '@apollo/client'
import { Form, Formik } from 'formik'
import { object, string } from 'yup'
import Modal, { ModalHeader } from '../modal'
import FieldError from '../forms/field_error'
import Button from '../button'
import FormField from '../forms/form_field'

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
      <ModalHeader onClose={onClose}>New Project</ModalHeader>

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
              <FormField
                id="name"
                name="name"
                placeholder="e.g. Redesign the App, Build V2 platform"
              />
              <FieldError forField="name" />
            </div>

            <div className="flex flex-col mt-3">
              <Label htmlFor="abbreviation">Abbreviation</Label>
              <FormField
                id="abbreviation"
                name="abbreviation"
                placeholder="e.g. ATM0001"
                className="max-w-[10rem]"
              />
              <FieldError forField="abbreviation" />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 block mx-auto"
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default CreateProjectModal
