import { twMerge } from 'tailwind-merge'
import Button from './button'

const PlusButton = ({ children, className = '', ...props }) => {
  return (
    <Button
      {...props}
      type="button"
      className={twMerge(
        'border border-violet-300 text-slate-800 font-medium rounded-xl px-4 py-2 flex items-center bg-white transition hover:scale-105 duration-200 shadow-shiny-button tracking-wide text-base',
        className
      )}
    >
      <span className="inline-flex gap-x-2 items-center w-full">
        <i className="fas fa-plus text-violet-600 text-xl" />
        <span className="text-center flex-grow">{children}</span>
      </span>
    </Button>
  )
}

export default PlusButton
