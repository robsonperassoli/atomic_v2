import { forwardRef } from 'react'
import { Menu } from '@headlessui/react'
import classNames from 'classnames'

const ItemButton = forwardRef(({ children, active = false, onClick }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={classNames(
        'block px-3 py-3 w-full text-left font-medium ',
        active ? 'bg-purple-600 text-white' : 'text-slate-700'
      )}
    >
      {children}
    </button>
  )
})

const ProjectSelector = ({ className = '' }) => (
  <Menu as="div" className={className}>
    <Menu.Button className="appearance-none focus:outline-none border-b border-slate-300  tracking-wide inline-flex flex-col pb-1 px-1">
      <span className="text-slate-400 text-sm pb-1">Project</span>
      <span className="flex items-center gap-2">
        <span className="font-semibold text-slate-800 tracking-wide">
          Atomic V2 Development
        </span>
        <i className="fas fa-chevron-down text-slate-400" />
      </span>
    </Menu.Button>

    <Menu.Items className="absolute bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mt-1">
      <Menu.Item as="div">
        {({ active }) => (
          <ItemButton active={active}>
            The House <small>[THHOUSE]</small>
          </ItemButton>
        )}
      </Menu.Item>
      <Menu.Item as="div">
        {({ active }) => (
          <ItemButton active={active}>
            Another random project <small>[ARPRJCT]</small>
          </ItemButton>
        )}
      </Menu.Item>
      <hr className="my-1 border-slate-200" />
      <Menu.Item as="div">
        {({ active }) => (
          <ItemButton active={active}>
            <i className="fas fa-plus text-xl mr-2" /> Create Project
          </ItemButton>
        )}
      </Menu.Item>
    </Menu.Items>
  </Menu>
)

export default ProjectSelector
