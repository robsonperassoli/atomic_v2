import { gql, useMutation } from '@apollo/client'
import classNames from 'classnames'
import { DateTime } from 'luxon'
import useTaskTimer from '../../../hooks/use_task_timer'
import { TASK_STATUSES } from '../../../tasks'
import TaskTime from '../../task_time'
import TaskStatusText from '../../task_status_text'

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

const EditButton = (props) => {
  return (
    <button
      {...props}
      type="button"
      className="appearance-none focus:outline-none hover:bg-slate-50 text-violet-600 text-sm h-6 w-6 rounded-full"
    >
      <i className="fas fa-pencil" />
    </button>
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
  onEdit,
}) => {
  const [stopTimer] = useMutation(STOP_TIMER_MUTATION)
  const [startTimer] = useMutation(START_TIMER_MUTATION)

  const timeInSec = useTaskTimer({ status, timeSec, startedAt: lastStartedAt })

  return (
    <li
      className={classNames(
        'flex flex-col sm:flex-row items-center justify-between py-2 sm:py-4',
        className
      )}
    >
      <div className="max-w-3xl">
        <p className="text-sm tracking-wide text-slate-700 font-medium">
          {content} <EditButton onClick={onEdit} />
        </p>

        <TaskStatusText
          lastStoppedAt={lastStoppedAt}
          lastStartedAt={lastStartedAt}
        />
      </div>

      <div>
        <TaskTime
          timeInSec={timeInSec}
          active={status === TASK_STATUSES.RUNNING}
          className="mr-2 sm:mr-4 mt-4 sm:mt-0"
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
