import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../apollo_client'
import '../styles/globals.scss'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

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
