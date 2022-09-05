import { gql, useQuery } from '@apollo/client'
import { DateTime } from 'luxon'
import TaskTime from '../../task_time'
import Task from './task'
import WeekdaySelector from './weekday_selector'
import EmptyTaskList from './empty_task_list'
import { useMemo, useState } from 'react'

const TASKS_QUERY = gql`
  query TaskListQuery(
    $projectId: ID!
    $startTime: DateTime!
    $endTime: DateTime!
  ) {
    project(id: $projectId) {
      tasks(startTime: $startTime, endTime: $endTime) {
        id
        content
        timeSec
      }
    }
  }
`

const TaskList = ({ project }) => {
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate())

  const dateFilter = useMemo(() => {
    const luxonDate = DateTime.fromISO(selectedDate)

    const startTime = luxonDate.startOf('day').toISO()
    const endTime = luxonDate.endOf('day').toISO()

    return { startTime, endTime }
  }, [selectedDate])

  const { data, loading } = useQuery(TASKS_QUERY, {
    variables: {
      projectId: project?.id,
      ...dateFilter,
    },
    skip: !project,
  })

  const tasks = data?.project?.tasks || []

  return (
    <section className="rounded-xl bg-white border border-violet-300 mt-5 overflow-hidden">
      <WeekdaySelector
        className="border-b border-violet-300"
        value={selectedDate}
        onChange={setSelectedDate}
      />
      {tasks.length > 0 ? (
        <>
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
        </>
      ) : (
        <EmptyTaskList />
      )}
    </section>
  )
}

export default TaskList
