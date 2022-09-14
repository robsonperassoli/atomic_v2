import ProjectSelector from './project_selector'
import WeekSelector from './week_selector'
import PlusButton from '../../plus_button'

const ControlBar = ({
  selectedProject,
  projects,
  onProjectSelected,
  selectedDate,
  onDateChanged,
  onCreateProject,
  onCreateTask,
}) => {
  return (
    <section className="flex items-end justify-start gap-4 mt-4">
      <WeekSelector date={selectedDate} onChange={onDateChanged} />

      <PlusButton onClick={onCreateTask} className="w-44">
        Create task
      </PlusButton>

      <div className="flex-grow" />

      <ProjectSelector
        selected={selectedProject}
        projects={projects}
        onChange={onProjectSelected}
        onCreate={onCreateProject}
        className="justify-self-end"
      />
    </section>
  )
}

export default ControlBar
