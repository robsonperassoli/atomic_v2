import { Popover } from '@headlessui/react'
import { DateTime } from 'luxon'
import { useMemo } from 'react'
import { Calendar } from 'react-calendar'

const MONTH_DAY = 'LLL, dd'

const WeekSelector = ({ date, onChange }) => {
  const weekLabel = useMemo(() => {
    const luxonDate = DateTime.fromISO(date)

    return `${luxonDate.startOf('week').toFormat(MONTH_DAY)} to ${luxonDate
      .endOf('week')
      .toFormat(MONTH_DAY)}`
  }, [date])

  const _onChange = (jsDate) => {
    const isoDate = DateTime.fromJSDate(jsDate).toISODate()
    onChange(isoDate)
  }

  return (
    <Popover className="relative">
      <Popover.Button className="appearance-none focus:outline-none border-b border-slate-300  tracking-wide inline-flex flex-col pb-1 px-1">
        <span className="text-slate-400 text-sm pb-1">Week</span>
        <span className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 tracking-wide">
            {weekLabel}
          </span>
          <i className="fas fa-chevron-down text-slate-400" />
        </span>
      </Popover.Button>

      <Popover.Panel className="absolute z-10 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mt-1">
        <Calendar
          value={DateTime.fromISO(date).toJSDate()}
          onChange={_onChange}
          minDetail="month"
          next2Label={null}
          prev2Label={null}
          className="week-selector"
          nextLabel={<i className="fas fa-chevron-right" />}
          prevLabel={<i className="fas fa-chevron-left" />}
        />
      </Popover.Panel>
    </Popover>
  )
}

export default WeekSelector
