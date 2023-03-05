import { DateTime } from 'luxon'

const toRelativeTime = (isoDateStr) => DateTime.fromISO(isoDateStr).toRelative()

const TaskStatusText = ({ lastStoppedAt, lastStartedAt }) => {
  if (!lastStoppedAt && !lastStartedAt) {
    return null
  }

  const text = !!lastStoppedAt
    ? `Stopped ${toRelativeTime(lastStoppedAt)}`
    : `Started ${toRelativeTime(lastStartedAt)}`

  return (
    <span
      className="text-slate-500 text-xs font-medium italic leading-2 hidden sm:block pt-1"
      title={DateTime.fromISO(lastStoppedAt || lastStartedAt).toFormat('FF')}
    >
      {text}
    </span>
  )
}

export default TaskStatusText
