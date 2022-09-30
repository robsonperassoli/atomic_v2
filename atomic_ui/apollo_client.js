import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  split,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { onError } from '@apollo/client/link/error'
import * as AbsintheSocket from '@absinthe/socket'
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link'
import { Socket as PhoenixSocket } from 'phoenix'
import { GRAPHQL_URL, WS_URL } from './config'

const cache = new InMemoryCache()

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
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

const createClient = (httpWsLink) => {
  return new ApolloClient({
    link: from([errorLink, httpWsLink]),
    cache,
  })
}

export const createWsAndHttpLink = (token) => {
  const socket = new PhoenixSocket(WS_URL, {
    params: { token },
  })

  const absintheSocket = AbsintheSocket.create(socket)
  const wsLink = createAbsintheSocketLink(absintheSocket)

  socket.connect()

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)

      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )
}

export const createHttpClient = () => createClient(httpLink)
