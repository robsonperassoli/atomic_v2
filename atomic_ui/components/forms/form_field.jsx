import { Field } from 'formik'
import { twMerge } from 'tailwind-merge'

const FormField = ({ className = '', ...props }) => (
  <Field
    {...props}
    className={twMerge(
      'border border-violet-300 font-medium text-slate-800 rounded-lg px-3 py-3 placeholder:italic placeholder:text-slate-500 placeholder:text-sm placeholder:font-medium tracking-wide outline-violet-400',
      className
    )}
  />
)

export default FormField
