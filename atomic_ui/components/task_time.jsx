import classNames from 'classnames'
import { Duration } from 'luxon'
import { useMemo } from 'react'

const TimeChunk = ({ time, descriptor, bold = false }) => (
  <span className="inline-flex items-end">
    <span
      className={classNames(
        'inline-block',
        bold ? 'font-black text-4xl leading-7' : 'font-light text-2xl leading-5'
      )}
    >
      {time}
    </span>
    <span className="text-sm tracking-wide inline-block ml-1 leading-3">
      {descriptor}
    </span>
  </span>
)

const TaskTime = ({ timeInSec, active = false, className = '' }) => {
  const { hours, minutes } = useMemo(() => {
    const d = Duration.fromObject({ seconds: timeInSec })
    const [hours, minutes] = d.toFormat('h m').split(' ')

    return {
      hours: Number(hours),
      minutes: Number(minutes),
    }
  }, [timeInSec])

  return (
    <span
      className={classNames(
        'inline-flex items-end flex-shrink-0 select-none transition-colors duration-200',
        active ? 'text-violet-600' : 'text-slate-600',
        className
      )}
    >
      {hours > 0 && (
        <>
          <TimeChunk time={hours} descriptor="h" bold />
          <span className="inline-block px-1 text-2xl font-light tracking-wide leading-5">
            :
          </span>
        </>
      )}

      <TimeChunk time={minutes} descriptor="min" bold={hours === 0} />
    </span>
  )
}

export default TaskTime
