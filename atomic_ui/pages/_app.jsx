import { ApolloProvider, gql, useQuery } from '@apollo/client'
import Layout from '../components/layout'
import { apolloClient } from '../apollo_client'
import '../styles/globals.scss'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Atomic - Time Tracking</title>
      </Head>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </>
  )
}

export default MyApp
