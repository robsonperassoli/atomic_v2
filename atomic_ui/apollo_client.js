import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'

import { GRAPHQL_URL } from './config'

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    console.log(graphQLErrors)
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, code, locations, path }) => {
        switch (code) {
          case 'NOT_AUTHENTICATED':
            window.location.href = '/login'
            break
        }
      })
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
    }
  }
)

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})
