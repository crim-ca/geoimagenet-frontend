import {ApolloClient} from 'apollo-client';
import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from 'apollo-upload-client';
import {websocketify_uri} from '../utils/functions';
import {features} from '../../features';
import https from 'https';

/**
 * Creates an apollo client with a link supporting websockets for the subscriptions (feature flag based), http queries for normal
 * queries as well as uploading files.
 * @param GRAPHQL_ENDPOINT String
 * @returns ApolloClient
 */
export function create_client(GRAPHQL_ENDPOINT) {

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
                agent: new https.Agent({rejectUnauthorized: false}),
            }
        });
        const ws_link = new WebSocketLink({
            uri: websocketify_uri(GRAPHQL_ENDPOINT),
        });

        link = split(
            ({query}) => {
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
                agent: new https.Agent({rejectUnauthorized: false}),
            }
        });
    }

    return new ApolloClient({
        cache,
        link
    });
}
