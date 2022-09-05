import { gql, useQuery } from '@apollo/client'
import useLocalStorage from '../hooks/use_local_storage'
import ControlBar from '../components/pages/index/control_bar'
import TaskList from '../components/pages/index/task_list'
import { useMemo } from 'react'

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
      />
      <TaskList project={selectedProject} />
    </>
  )
}

export default Home
