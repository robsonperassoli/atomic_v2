import { gql, useQuery } from '@apollo/client'
import useLocalStorage from '../hooks/use_local_storage'
import ControlBar from '../components/pages/index/control_bar'
import TaskList from '../components/pages/index/task_list'
import { useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import CreateProjectModal from '../components/projects/create_project_modal'
import CreateTaskModal from '../components/projects/create_task_modal'
import Layout from '../components/layout'

const PROJECTS_QUERY = gql`
  query ProjectsSelectorQuery {
    projects {
      id
      name
      abbreviation
    }
  }
`

const TASK_LIST_QUERY = gql`
  query TaskListQuery(
    $projectId: ID!
    $startTime: DateTime!
    $endTime: DateTime!
  ) {
    project(id: $projectId) {
      id
      tasks(startTime: $startTime, endTime: $endTime) {
        id
        content
        timeSec
        status
        lastStartedAt
        lastStoppedAt
      }
    }
  }
`

const MODALS = {
  CREATE_PROJECT: 'CREATE_PROJECT',
  CREATE_TASK: 'CREATE_TASK',
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

  const dateFilter = useMemo(() => {
    const luxonDate = DateTime.fromISO(selectedDate)

    const startTime = luxonDate.startOf('day').toISO()
    const endTime = luxonDate.endOf('day').toISO()

    return { startTime, endTime }
  }, [selectedDate])

  const {
    data: tasksData,
    loading: loadingTasks,
    refetch: refetchTasks,
  } = useQuery(TASK_LIST_QUERY, {
    skip: !selectedProjectId || !selectedDate,
    variables: {
      projectId: selectedProjectId,
      ...dateFilter,
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

  const tasks = tasksData?.project?.tasks || []

  const closeModal = () => setModal(null)

  const onProjectCreated = (project) => {
    closeModal()

    setSelectedProjectId(project.id)
    refetchProjects()
  }

  const onTaskCreated = (_task) => {
    closeModal()

    refetchTasks()
  }

  return (
    <>
      <ControlBar
        selectedProject={selectedProject}
        projects={projects}
        onProjectSelected={(p) => setSelectedProjectId(p.id)}
        onCreateProject={() => setModal(MODALS.CREATE_PROJECT)}
        onCreateTask={() => setModal(MODALS.CREATE_TASK)}
        selectedDate={selectedDate}
        onDateChanged={setSelectedDate}
      />
      <TaskList
        date={selectedDate}
        onDateChanged={setSelectedDate}
        tasks={tasks}
      />
      <CreateProjectModal
        isOpen={modal === MODALS.CREATE_PROJECT}
        onClose={closeModal}
        onProjectCreated={onProjectCreated}
      />

      <CreateTaskModal
        isOpen={modal === MODALS.CREATE_TASK}
        onClose={closeModal}
        onTaskCreated={onTaskCreated}
        projectId={selectedProjectId}
      />
    </>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
