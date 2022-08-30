import { ApolloProvider, gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import Layout from '../components/layout'

import { apolloClient } from '../apollo_client'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Atomic - Time Tracking</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
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
