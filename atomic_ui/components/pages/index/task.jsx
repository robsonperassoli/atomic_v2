import { gql, useMutation } from '@apollo/client'
import classNames from 'classnames'
import { DateTime } from 'luxon'
import { TASK_STATUSES } from '../../../tasks'
import TaskTime from '../../task_time'

const START_TIMER_MUTATION = gql`
  mutation StartTimer($taskId: ID!) {
    startTaskTimer(taskId: $taskId) {
      id
      status
      timeSec
      lastStoppedAt
      lastStartedAt
    }
  }
`

const STOP_TIMER_MUTATION = gql`
  mutation StopTimer($taskId: ID!) {
    stopTaskTimer(taskId: $taskId) {
      id
      status
      timeSec
      lastStoppedAt
      lastStartedAt
    }
  }
`

const ActionButton = ({ stopped = false, ...props }) => (
  <button
    {...props}
    type="button"
    className="appearance-none focus:outline-none inline-flex items-center justify-center rounded-full w-10 h-10 bg-slate-100 hover:bg-slate-200 text-violet-600 text-2xl transition-colors duration-200"
  >
    <i className={classNames('fas', stopped ? 'fa-play' : 'fa-stop')} />
  </button>
)

const toRelativeTime = (isoDateStr) => DateTime.fromISO(isoDateStr).toRelative()

const TaskStatusText = ({ lastStoppedAt, lastStartedAt }) => {
  if (!lastStoppedAt && !lastStartedAt) {
    return null
  }

  const text = !!lastStoppedAt
    ? `Stopped ${toRelativeTime(lastStoppedAt)}`
    : `Started ${toRelativeTime(lastStartedAt)}`

  return (
    <span className="text-slate-500 text-xs font-medium italic leading-2 block pt-1">
      {text}
    </span>
  )
}

const Task = ({
  id,
  content,
  status,
  timeSec,
  lastStartedAt,
  lastStoppedAt,
  className = '',
}) => {
  const [stopTimer] = useMutation(STOP_TIMER_MUTATION)
  const [startTimer] = useMutation(START_TIMER_MUTATION)

  return (
    <li
      className={classNames(
        'flex items-center justify-between py-4',
        className
      )}
    >
      <div className="max-w-3xl">
        <p className="text-sm tracking-wide text-slate-700 font-medium">
          {content}
        </p>

        <TaskStatusText
          lastStoppedAt={lastStoppedAt}
          lastStartedAt={lastStartedAt}
        />
      </div>

      <div>
        <TaskTime
          timeInSec={timeSec}
          active={status === TASK_STATUSES.RUNNING}
          className="mr-4"
        />
        {status === TASK_STATUSES.RUNNING && (
          <ActionButton
            onClick={() => stopTimer({ variables: { taskId: id } })}
          />
        )}
        {status === TASK_STATUSES.STOPPED && (
          <ActionButton
            stopped
            onClick={() => startTimer({ variables: { taskId: id } })}
          />
        )}
      </div>
    </li>
  )
}

export default Task
