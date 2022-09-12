import { DateTime } from 'luxon'
import TaskTime from '../../task_time'
import Task from './task'
import WeekdaySelector from './weekday_selector'
import EmptyTaskList from './empty_task_list'
import { useMemo } from 'react'

const TaskList = ({ tasks = [], date, onDateChanged, onEditTask }) => {
  const totalDailyTime = useMemo(
    () => tasks.reduce((totalTime, task) => totalTime + task.timeSec, 0),
    [tasks]
  )

  return (
    <section className="rounded-xl bg-white border border-violet-300 mt-5 overflow-hidden">
      <WeekdaySelector
        className="border-b border-violet-300"
        value={date}
        onChange={onDateChanged}
      />
      {tasks.length > 0 ? (
        <>
          <ul className="px-4">
            {tasks.map((task, i) => (
              <Task
                key={task.id}
                {...task}
                className={i > 0 ? 'border-t border-violet-300' : null}
                onEdit={() => onEditTask(task)}
              />
            ))}
          </ul>
          <footer className="border-t border-violet-300 flex items-center justify-end px-4 py-6 gap-6">
            <span className="text-slate-800 tracking-wide">Daily Total</span>
            <TaskTime timeInSec={totalDailyTime} />
          </footer>
        </>
      ) : (
        <EmptyTaskList />
      )}
    </section>
  )
}

export default TaskList
