import { twMerge } from 'tailwind-merge'

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      type="button"
      {...props}
      className={twMerge(
        'rounded-lg text-2xl tracking-wide font-semibold text-white bg-violet-500 px-8 py-2 leading-7 inline-block',
        className
      )}
    >
      {children}
    </button>
  )
}

export default Button
