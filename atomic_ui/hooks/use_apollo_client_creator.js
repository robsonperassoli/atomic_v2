import { gql } from '@apollo/client'
import { useCallback, useEffect, useRef } from 'react'
import { createHttpClient, createWsAndHttpLink } from '../apollo_client'

const WEBSOCKET_TOKEN_MUTATION = gql`
  mutation CreateSocketToken {
    token: createWebsocketToken
  }
`

const useApolloClientCreator = (connectWebsocket = false) => {
  const apolloClientRef = useRef({
    websocket: false,
    client: createHttpClient(),
  })

  const createWebSocketLink = useCallback(async () => {
    try {
      if (apolloClientRef.current.websocket) {
        return
      }

      apolloClientRef.current.websocket = true

      const { client } = apolloClientRef.current

      const { data } = await client.mutate({
        mutation: WEBSOCKET_TOKEN_MUTATION,
      })

      client.setLink(createWsAndHttpLink(data.token))
    } catch (err) {
      console.error(err)
      apolloClientRef.current.websocket = false
    }
  }, [apolloClientRef])

  useEffect(() => {
    console.log('connectWebsocket', connectWebsocket)
    if (connectWebsocket) {
      createWebSocketLink()
    }
  }, [connectWebsocket])

  return apolloClientRef.current.client
}

export default useApolloClientCreator
