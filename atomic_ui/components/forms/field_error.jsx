import { useField } from 'formik'

const FieldError = ({ forField }) => {
  const [_field, meta, _helpers] = useField(forField)

  if (meta.touched && meta.error) {
    return (
      <span className="text-sm text-pink-600 pt-1 italic tracking-wide">
        {meta.error}
      </span>
    )
  }

  return null
}

export default FieldError
