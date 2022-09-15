import { gql, useQuery } from '@apollo/client'
import useLocalStorage from '../hooks/use_local_storage'
import ControlBar from '../components/pages/index/control_bar'
import TaskList from '../components/pages/index/task_list'
import { useCallback, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import CreateProjectModal from '../components/projects/create_project_modal'
import CreateTaskModal from '../components/projects/create_task_modal'
import Layout from '../components/layout'
import UpdateTaskModal from '../components/projects/update_task_modal'
import useModal from '../hooks/use_modal'
import ZeroState from '../components/pages/index/zero_state'

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
  UPDATE_TASK: 'UPDATE_TASK',
}

const Home = () => {
  const modal = useModal()
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

  const onProjectCreated = (project) => {
    modal.close()

    setSelectedProjectId(project.id)
    refetchProjects()
  }

  const onTaskCreated = (_task) => {
    modal.close()

    refetchTasks()
  }

  const onTaskUpdated = (_task) => modal.close()

  if (loading) {
    return null
  }

  return (
    <>
      {projects?.length > 0 ? (
        <>
          <ControlBar
            selectedProject={selectedProject}
            projects={projects}
            onProjectSelected={(p) => setSelectedProjectId(p.id)}
            onCreateProject={() => modal.open(MODALS.CREATE_PROJECT)}
            onCreateTask={() => modal.open(MODALS.CREATE_TASK)}
            selectedDate={selectedDate}
            onDateChanged={setSelectedDate}
          />
          <TaskList
            date={selectedDate}
            onDateChanged={setSelectedDate}
            tasks={tasks}
            onEditTask={(task) => modal.open(MODALS.UPDATE_TASK, { task })}
          />
        </>
      ) : (
        <ZeroState
          onCreateProjectClick={() => modal.open(MODALS.CREATE_PROJECT)}
        />
      )}

      <CreateProjectModal
        isOpen={modal.isOpen(MODALS.CREATE_PROJECT)}
        onClose={modal.close}
        onProjectCreated={onProjectCreated}
      />

      <CreateTaskModal
        isOpen={modal.isOpen(MODALS.CREATE_TASK)}
        onClose={modal.close}
        onTaskCreated={onTaskCreated}
        projectId={selectedProjectId}
      />

      <UpdateTaskModal
        isOpen={modal.isOpen(MODALS.UPDATE_TASK)}
        onClose={modal.close}
        onTaskUpdated={onTaskUpdated}
        task={modal.props?.task}
      />
    </>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
