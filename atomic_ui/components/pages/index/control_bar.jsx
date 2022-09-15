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
    <section className="flex flex-col sm:flex-row items-end justify-start gap-4 mt-4">
      <div className="w-full sm:w-auto flex-grow flex gap-4 justify-between sm:justify-start">
        <WeekSelector date={selectedDate} onChange={onDateChanged} />

        <PlusButton onClick={onCreateTask} className="w-44 self-end">
          Create task
        </PlusButton>
      </div>

      <ProjectSelector
        selected={selectedProject}
        projects={projects}
        onChange={onProjectSelected}
        onCreate={onCreateProject}
        className="flex-grow flex-grow-0 w-full sm:w-auto justify-self-end"
      />
    </section>
  )
}

export default ControlBar
