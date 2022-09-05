import classNames from 'classnames'
import { DateTime, Duration } from 'luxon'
import { useMemo } from 'react'

const WeekdaySelector = ({ className, value, onChange }) => {
  const weekDates = useMemo(() => {
    const date = DateTime.fromISO(value)

    return new Array(7)
      .fill(0)
      .map((_v, i) =>
        date.startOf('week').plus(Duration.fromObject({ days: i }))
      )
  }, [value])

  const today = DateTime.now().toISODate()

  return (
    <ul className={classNames('grid grid-cols-7', className)}>
      {weekDates.map((d, i) => (
        <li
          key={d}
          className={classNames(
            'flex-grow transition-colors duration-400',
            d.toISODate() === value
              ? 'bg-amber-50'
              : 'bg-white hover:bg-slate-50',
            {
              'border-l border-slate-300': i > 0,
            }
          )}
        >
          <button
            className="flex justify-between items-center h-full w-full p-4"
            disabled={d.toISODate() === value}
            onClick={() => onChange(d.toISODate())}
          >
            <span className="flex flex-col items-start">
              <span className="font-black text-black text-xl tracking-widest">
                {d.weekdayShort}
              </span>
              <span className="text-slate-500 text-sm font-semibold">
                {d.monthShort}, {d.day}
              </span>
            </span>

            {today === d.toISODate() && (
              <i className="fas fa-asterisk text-amber-600 text-3xl" />
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default WeekdaySelector
