import { gql, useQuery } from '@apollo/client'

const HELLO_QUERY = gql`
  {
    hello
  }
`

const Home = () => {
  const { data, loading, error } = useQuery(HELLO_QUERY)
  console.log(data, loading, error)
  return null
}

export default Home
