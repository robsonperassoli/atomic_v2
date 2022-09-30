import { ApolloProvider } from '@apollo/client'
import useApolloClientCreator from '../hooks/use_apollo_client_creator'
import '../styles/globals.scss'
import Head from 'next/head'
import { useRouter } from 'next/router'

const noWebsocketPages = ['/login']
const websocketEnabled = (path) => noWebsocketPages.indexOf(path) === -1

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()
  const apolloClient = useApolloClientCreator(websocketEnabled(router.pathname))

  return (
    <>
      <Head>
        <title>Atomic - Time Tracking</title>
      </Head>
      <ApolloProvider client={apolloClient}>
        {getLayout(<Component {...pageProps} />)}
      </ApolloProvider>
    </>
  )
}

export default MyApp
