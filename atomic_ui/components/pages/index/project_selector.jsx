import { forwardRef, useMemo } from 'react'
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

const ProjectSelector = ({
  selected,
  projects,
  onChange,
  onCreate,
  className = '',
}) => {
  const projectsOptions = useMemo(
    () => (selected ? projects.filter((p) => p.id !== selected.id) : projects),
    [selected?.id]
  )

  return (
    <Menu as="div" className={classNames('relative', className)}>
      <Menu.Button className="appearance-none focus:outline-none border-b border-slate-300  tracking-wide inline-flex flex-col pb-1 px-1 min-w-[10rem]">
        <span className="text-slate-400 text-sm pb-1">Project</span>
        <span className="flex items-center gap-2 w-full">
          <span className="font-semibold text-slate-800 tracking-wide flex-grow text-left">
            {selected?.name}
          </span>
          <i className="fas fa-chevron-down text-slate-400" />
        </span>
      </Menu.Button>

      <Menu.Items className="absolute right-0 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mt-1 min-w-[15rem]">
        {projectsOptions.map((p) => (
          <Menu.Item as="div" key={p.id}>
            {({ active }) => (
              <ItemButton active={active} onClick={() => onChange(p)}>
                {p.name} <small>[{p.abbreviation}]</small>
              </ItemButton>
            )}
          </Menu.Item>
        ))}

        <hr className="my-1 border-slate-200" />
        <Menu.Item as="div">
          {({ active }) => (
            <ItemButton active={active} onClick={onCreate}>
              <i className="fas fa-plus text-xl mr-2" /> Create Project
            </ItemButton>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

export default ProjectSelector
