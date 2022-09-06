import { gql, useQuery } from '@apollo/client'
import useLocalStorage from '../hooks/use_local_storage'
import ControlBar from '../components/pages/index/control_bar'
import TaskList from '../components/pages/index/task_list'
import { useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import CreateProjectModal from '../components/projects/create_project_modal'

const PROJECTS_QUERY = gql`
  query ProjectsSelectorQuery {
    projects {
      id
      name
      abbreviation
    }
  }
`

const MODALS = {
  CREATE_PROJECT: 'CREATE_PROJECT',
}

const Home = () => {
  const [modal, setModal] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    'selectedProjectId',
    null
  )
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate())

  const {
    data,
    loading,
    refetch: refetchProjects,
  } = useQuery(PROJECTS_QUERY, {
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

  const closeModal = () => setModal(null)

  const onProjectCreated = (project) => {
    closeModal()

    setSelectedProjectId(project.id)
    refetchProjects()
  }

  return (
    <>
      <ControlBar
        selectedProject={selectedProject}
        projects={projects}
        onProjectSelected={(p) => setSelectedProjectId(p.id)}
        onCreateProject={() => setModal(MODALS.CREATE_PROJECT)}
        selectedDate={selectedDate}
        onDateChanged={setSelectedDate}
      />
      <TaskList
        date={selectedDate}
        onDateChanged={setSelectedDate}
        project={selectedProject}
      />
      <CreateProjectModal
        isOpen={modal === MODALS.CREATE_PROJECT}
        onClose={closeModal}
        onProjectCreated={onProjectCreated}
      />
    </>
  )
}

export default Home
