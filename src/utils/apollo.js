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
 * removing the typename from the responses because it breaks automatic displaying of results, taken from https://github.com/apollographql/apollo-client/issues/1913#issuecomment-374869527
 * Not quite sure what the typename part itself does, comments suggest it affects caching, I deem the risks of not caching responses
 * in the most efficient way to be sufficiently low in this prototype context to not really bother with this.
 * @type {InMemoryCache}
 */
const cache = new InMemoryCache({
    addTypename: false
});

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

export const client = new ApolloClient({
    cache,
    link
});
