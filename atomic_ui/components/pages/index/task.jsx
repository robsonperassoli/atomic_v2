import classNames from 'classnames'
import { DateTime } from 'luxon'
import { TASK_STATUSES } from '../../../tasks'
import TaskTime from '../../task_time'

const ActionButton = ({ stopped = false, ...props }) => (
  <button
    {...props}
    type="button"
    className="appearance-none focus:outline-none inline-flex items-center justify-center rounded-full w-10 h-10 bg-slate-100 hover:bg-slate-200 text-violet-600 text-2xl transition-colors duration-200"
  >
    <i className={classNames('fas', stopped ? 'fa-play' : 'fa-stop')} />
  </button>
)

const Task = ({
  id,
  content,
  status,
  timeSec,
  lastStartedAt,
  className = '',
}) => {
  return (
    <li
      className={classNames(
        'flex items-center justify-between py-2',
        className
      )}
    >
      <div className="max-w-3xl">
        <p className="text-sm tracking-wide text-slate-700 font-medium">
          {content}
        </p>
        <span className="text-slate-500 text-xs font-medium italic leading-2 block pt-1">
          {status} {DateTime.fromJSDate(lastStartedAt).toRelative()}
        </span>
      </div>

      <div>
        <TaskTime
          timeInSec={timeSec}
          active={status === TASK_STATUSES.RUNNING}
          className="mr-4"
        />
        {status === TASK_STATUSES.RUNNING && <ActionButton />}
        {status === TASK_STATUSES.STOPPED && <ActionButton stopped />}
      </div>
    </li>
  )
}

export default Task
