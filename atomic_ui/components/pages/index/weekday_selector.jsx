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
            className="flex justify-between items-center h-full w-full p-2 md:p-4 relative"
            disabled={d.toISODate() === value}
            onClick={() => onChange(d.toISODate())}
          >
            <span className="flex flex-col items-center sm:items-start w-full">
              <span className="font-black text-black text-base sm:text-lg md:text-xl tracking-wider sm:tracking-widest">
                {d.weekdayShort}
              </span>
              <span className="text-slate-500 text-xs sm:text-sm font-semibold">
                <span className="hidden sm:inline">
                  {d.monthShort}, {d.day}
                </span>
                <span className="inline sm:hidden">{d.toFormat('L/d')}</span>
              </span>
            </span>

            {today === d.toISODate() && (
              <i className="fas fa-asterisk text-amber-600 text-sm m:text-lg lg:text-3xl absolute sm:relative top-0.5 right-0.5" />
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default WeekdaySelector
