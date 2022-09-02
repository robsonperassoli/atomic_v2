import { ApolloProvider, gql, useQuery } from '@apollo/client'
import Layout from '../components/layout'
import { apolloClient } from '../apollo_client'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </>
  )
}

export default MyApp
