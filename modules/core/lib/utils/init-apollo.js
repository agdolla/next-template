import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from 'apollo-utilities'

import { createSubscriptionClient } from 'lib/utils/create-subscription-client'
import {openSnackbar } from 'mui-redux-alerts';
import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig()
const {SERVER_URL} = publicRuntimeConfig
const isFile = value => (
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob)
);
 const isUpload = ({ variables }) =>
  Object.values(variables).some(isFile);

 const isSubscriptionOperation = ({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operation === 'subscription';
};
//const GRAPHQL_URL=`https://api-qdhhebsjkn.now.sh`
//const WS_URL=`wss://api-qdhhebsjkn.now.sh`
const GRAPHQL_URL= process.env.NODE_ENV === 'production' ? `https://${SERVER_URL}/graphql` : `http://localhost:3000/graphql`
const WS_URL = process.env.NODE_ENV === 'production' ? `wss://${SERVER_URL}/subscriptions` :`ws://localhost:3000/subscriptions`

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create (initialState, { getToken, store }) {
  const ssrMode = !process.browser

  const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
    credentials: 'include',
  })

  const contextLink = setContext(
    async () => {
      const token = getToken()

      return {
        headers: {
          token,
        }
      }
    }
  )

  const errorLink = onError(
    ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(err => {
          store.dispatch(openSnackbar({message: err.message, autoHideDuration: 3000}))
        })
      }
      if (networkError) {
        store.dispatch(openSnackbar({message: networkError, autoHideDuration: 3000}))
      }
    }
  )

  let link = ApolloLink.from([errorLink, contextLink, httpLink])

  if (!ssrMode) {

    const wsLink = new WebSocketLink(
      createSubscriptionClient({
        wsUrl: WS_URL,
        store,
        getToken,
      })
    )
    const subscriptionLink = ApolloLink.from([errorLink, wsLink])
        
    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
    link = split(
      isSubscriptionOperation,
      subscriptionLink,
      link,
    )

    const uploadLink = createUploadLink({ 
      uri: GRAPHQL_URL,
      credentials: 'same-origin',
    });

    const uploadLinkWithContext = ApolloLink.from([
      errorLink, contextLink, uploadLink
    ])

    link = split(
      isUpload, uploadLinkWithContext, link
    )
  }

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: true, // Disables forceFetch on the server (so queries are only run once)
    link: link,
    cache: new InMemoryCache().restore(initialState || {}),
    shouldBatch: true,
  })
}

export default function initApollo (initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}
