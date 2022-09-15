import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query CurrentUserQuery {
    me {
      id
      name
      email
    }
  }
`

const useCurrentUser = () => {
  const { data } = useQuery(QUERY, {
    fetchPolicy: 'cache-and-network',
  })

  return data?.me
}

export default useCurrentUser
