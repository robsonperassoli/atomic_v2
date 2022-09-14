import classNames from 'classnames'
import PlusButton from '../../plus_button'

const Text = ({ children, className = '' }) => (
  <p className={classNames('text-slate-600 font-light text-xl', className)}>
    {children}
  </p>
)

const ZeroState = ({ onCreateProjectClick }) => {
  return (
    <div className="text-center max-w-xl mx-auto pt-10 lg:pt-32 xl:pt-44">
      <h2 className="text-slate-800 text-3xl font-bold">Welcome to Atomic!</h2>
      <Text className="mt-6">
        I can see you don{"'"}t have a project to work with, projects are a good
        way to separate your tasks.
      </Text>
      <Text className="mt-2">
        Click the button below to create yout first project 👇
      </Text>
      <PlusButton onClick={onCreateProjectClick} className="w-48 mx-auto mt-8">
        New Project
      </PlusButton>
    </div>
  )
}

export default ZeroState
