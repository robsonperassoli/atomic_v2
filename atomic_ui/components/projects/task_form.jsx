import { Duration } from 'luxon'
import { Form, Formik } from 'formik'
import { object, string, number } from 'yup'
import FieldError from '../forms/field_error'
import Button from '../button'
import FormField from '../forms/form_field'
import TaskTime from '../task_time'
import { TASK_STATUSES } from '../../tasks'

const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="text-slate-800 font-medium pb-1">
      {children}
    </label>
  )
}

const createGetValidationSchema = (isTimeRequired) => {
  const timeMin = number().min(0, "Time can't be negative")
  const timeMinRequired = timeMin.required('Time is required')

  return object().shape({
    content: string().required('Task Content is required').min(10),
    timeMin: isTimeRequired ? timeMinRequired : timeMin,
  })
}

const TaskForm = ({ submitLabel, onSubmit, task = null }) => {
  const updateTimeEnabled = task?.status !== TASK_STATUSES.RUNNING
  return (
    <Formik
      initialValues={{
        content: task?.content || '',
        timeMin: task
          ? Duration.fromObject({ seconds: task.timeSec })
              .as('minutes')
              .toFixed(0)
          : 0,
      }}
      onSubmit={onSubmit}
      validationSchema={createGetValidationSchema(updateTimeEnabled)}
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
                {updateTimeEnabled && (
                  <>
                    <Label htmlFor="timeMin">
                      Time <small className="text-slate-400">(min)</small>
                    </Label>
                    <FormField
                      id="timeMin"
                      name="timeMin"
                      readOnly={!updateTimeEnabled}
                      className="max-w-[10rem]"
                    />
                  </>
                )}

                {values.timeMin > 0 && (
                  <TaskTime
                    timeInSec={Duration.fromObject({
                      minutes: values.timeMin,
                    }).as('seconds')}
                    active={!updateTimeEnabled}
                  />
                )}
              </div>

              <FieldError forField="timeSec" />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default TaskForm
