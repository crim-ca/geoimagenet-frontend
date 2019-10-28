// @flow strict
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { split, from } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { websocketify_uri } from '../utils/functions';
import { features } from '../../features';
import https from 'https';
import { onError } from 'apollo-link-error';
import { NotificationManager } from 'react-notifications';
import { captureException } from '@sentry/browser';

/**
 * Creates an apollo client with a link supporting websockets for the subscriptions (feature flag based), http queries for normal
 * queries as well as uploading files.
 */
export function create_client<TCacheShape: {}>(GRAPHQL_ENDPOINT: string): ApolloClient<TCacheShape> {

  /**
   * @TODO at some point move this inside MobX?
   */
  const cache = new InMemoryCache();

  /**
   * Until we have time to properly structure subscriptions, only create a queries and uploads link.
   */
  let link;
  if (features.subscriptions) {
    const http_link = createUploadLink({
      uri: GRAPHQL_ENDPOINT,
      credentials: 'same-origin',
      fetchOptions: {
        agent: new https.Agent({ rejectUnauthorized: false }),
      }
    });
    const ws_link = new WebSocketLink({
      uri: websocketify_uri(GRAPHQL_ENDPOINT),
    });

    link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      ws_link,
      http_link,
    );
  } else {
    link = createUploadLink({
      uri: GRAPHQL_ENDPOINT,
      credentials: 'same-origin',
      fetchOptions: {
        agent: new https.Agent({ rejectUnauthorized: false }),
      }
    });
  }

  const error_link = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        captureException(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        NotificationManager.error('There was an error while communicating with GraphQL. There are little chance this ' +
          'will solve itself, please contact an administrator.');
      });
    }
    if (networkError) {
      captureException(`[Network error]: ${networkError}`);
      NotificationManager.error('There was an error while communicating with GraphQL. There are little chance this ' +
        'will solve itself, please contact an administrator.');
    }
  });


  return new ApolloClient({
    cache,
    link: from([error_link, link]),
  });
}
