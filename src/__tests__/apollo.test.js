import { websocketifyUri } from '../utils/functions';

test('websocket uri generated from http or https endpoint', () => {
  const http_ep = 'http://bobinette.com';
  const https_ep = 'https://other-domain.com';
  expect(websocketifyUri(http_ep))
    .toBe('ws://bobinette.com');
  expect(websocketifyUri(https_ep))
    .toBe('ws://other-domain.com');
});
