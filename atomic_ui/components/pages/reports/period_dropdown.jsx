import { Listbox } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useMemo } from 'react'

const PERIOD_OPTIONS = [
  { value: 'WEEK', label: 'This Week' },
  { value: 'MONTH', label: 'This Month' },
  { value: 'CUSTOM', label: 'Custom' },
]

const PeriodDropdown = ({ value, onChange }) => {
  const selectedOption = useMemo(
    () => PERIOD_OPTIONS.find((o) => o.value === value),
    [value]
  )
  return (
    <Listbox
      as="div"
      value={value}
      onChange={onChange}
      className="relative text-gray-800 font-medium"
    >
      <Listbox.Button className="rounded-lg border w-full inline-flex items-center p-2 bg-white text-left">
        <span className="flex-grow">{selectedOption?.label}</span>
        <i className="fas fa-chevron-down" />
      </Listbox.Button>
      <Listbox.Options className="border rounded-lg bg-white overflow-hidden mt-1 absolute inset-x-0">
        {PERIOD_OPTIONS.map((period) => (
          <Listbox.Option key={period.value} value={period.value} as={Fragment}>
            {({ active, selected }) => (
              <li
                className={classNames('p-2 cursor-pointer', {
                  'bg-violet-600 text-white': active,
                  'pl-8': !selected,
                })}
              >
                {selected && <i className="fas fa-check text-sm mr-2" />}
                {period.label}
              </li>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}

export default PeriodDropdown
