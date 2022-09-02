import { Popover } from '@headlessui/react'
import { Calendar } from 'react-calendar'

const WeekSelector = () => {
  return (
    <Popover className="relative">
      <Popover.Button className="appearance-none focus:outline-none border-b border-slate-300  tracking-wide inline-flex flex-col pb-1 px-1">
        <span className="text-slate-400 text-sm pb-1">Week</span>
        <span className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 tracking-wide">
            Aug, 28 to Sep, 03
          </span>
          <i className="fas fa-chevron-down text-slate-400" />
        </span>
      </Popover.Button>

      <Popover.Panel className="absolute z-10 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mt-1 p-2">
        <Calendar />
      </Popover.Panel>
    </Popover>
  )
}

export default WeekSelector
