import {websocketify_uri} from './functions';

test('websocket uri generated from http or https endpoint', () => {
    const http_ep = 'http://bobinette.com';
    const https_ep = 'https://other-domain.com';
    expect(websocketify_uri(http_ep)).toBe('ws://bobinette.com');
    expect(websocketify_uri(https_ep)).toBe('ws://other-domain.com');
});
