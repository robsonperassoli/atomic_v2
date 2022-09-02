import TaskTime from '../../task_time'
import Task from './task'
import WeekdaySelector from './weekday_selector'

const TaskList = () => {
  const tasks = [
    {
      id: '1',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      lastStartedAt: new Date(),
      lastStoppedAt: new Date(),
      timeSec: 130,
      status: 'running',
    },
    {
      id: '2',
      content:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      lastStartedAt: new Date(),
      lastStoppedAt: new Date(),
      timeSec: 12330,
      status: 'stopped',
    },
  ]
  return (
    <section className="rounded-xl bg-white border border-violet-300 mt-5 overflow-hidden">
      <WeekdaySelector className="border-b border-violet-300" />
      <ul className="px-4 py-2">
        {tasks.map((task, i) => (
          <Task
            key={task.id}
            {...task}
            className={i > 0 ? 'border-t border-violet-300' : null}
          />
        ))}
      </ul>
      <footer className="border-t border-violet-300 flex items-center justify-end px-4 py-6 gap-6">
        <span className="text-slate-800 tracking-wide">Daily Total</span>
        <TaskTime timeInSec={13444} />
      </footer>
    </section>
  )
}

export default TaskList
