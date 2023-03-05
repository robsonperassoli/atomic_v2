import { gql, useLazyQuery } from '@apollo/client'
import Modal, { MODAL_POSITION } from './modal'
import SearchInput from './search_input'
import TaskStatusText from './task_status_text'
import TaskTime from './task_time'

const SEARCH = gql`
  query SearchTasks($term: String!) {
    tasks(term: $term) {
      id
      content
      status
      timeSec
      lastStartedAt
      lastStoppedAt
    }
  }
`

const SearchDialog = ({ isOpen, onClose }) => {
  const [search, { data, loading, variables }] = useLazyQuery(SEARCH)
  const tasks = data?.tasks || []
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position={MODAL_POSITION.TOP}
      className="bg-transparent max-w-screen-md p-2 shadow-none"
    >
      <SearchInput onChange={(term) => search({ variables: { term } })} />

      <div className="bg-white rounded-3xl mt-4 overflow-hidden">
        {!variables.term ? (
          <p className="text-lg text-center px-16 py-8">
            Search for tasks by typing keywords included in tasks content.
          </p>
        ) : !loading && tasks.length === 0 ? (
          <p className="text-lg text-center px-16 py-8">
            No tasks found for <strong>{variables.term}</strong>, try searching
            using a different keyword.
          </p>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between py-3 px-6 border-b last:border-b-0 cursor-pointer hover:bg-slate-50"
              >
                <div>
                  <p className="text-slate-700">{t.content}</p>
                  {console.log(t)}
                  <TaskStatusText
                    lastStartedAt={t.lastStartedAt}
                    lastStoppedAt={t.lastStoppedAt}
                  />
                </div>
                <TaskTime timeInSec={t.timeSec} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}

export default SearchDialog
