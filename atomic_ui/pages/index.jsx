import { gql, useQuery } from '@apollo/client'
import useLocalStorage from '../hooks/use_local_storage'
import ControlBar from '../components/pages/index/control_bar'
import TaskList from '../components/pages/index/task_list'
import { useMemo, useState } from 'react'
import { DateTime } from 'luxon'

const PROJECTS_QUERY = gql`
  query ProjectsSelectorQuery {
    projects {
      id
      name
      abbreviation
    }
  }
`

const Home = () => {
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    'selectedProjectId',
    null
  )
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate())

  const { data, loading } = useQuery(PROJECTS_QUERY, {
    onCompleted: (data) => {
      if (!selectedProjectId) {
        setSelectedProjectId(data?.projects[0]?.id)
      }
    },
  })

  const projects = data?.projects || []
  const selectedProject = useMemo(
    () =>
      selectedProjectId
        ? projects.find((p) => p.id === selectedProjectId)
        : null,
    [projects, selectedProjectId]
  )

  return (
    <>
      <ControlBar
        selectedProject={selectedProject}
        projects={projects}
        onProjectSelected={(p) => setSelectedProjectId(p.id)}
        selectedDate={selectedDate}
        onDateChanged={setSelectedDate}
      />
      <TaskList
        date={selectedDate}
        onDateChanged={setSelectedDate}
        project={selectedProject}
      />
    </>
  )
}

export default Home
