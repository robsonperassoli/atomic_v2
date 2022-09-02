import { gql, useQuery } from '@apollo/client'
import ControlBar from '../components/pages/index/control_bar'
import TaskList from '../components/pages/index/task_list'

const HELLO_QUERY = gql`
  {
    hello
  }
`

const Home = () => {
  const { data, loading, error } = useQuery(HELLO_QUERY)

  return (
    <>
      <ControlBar />
      <TaskList />
    </>
  )
}

export default Home
