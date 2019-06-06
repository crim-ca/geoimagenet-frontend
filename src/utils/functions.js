export function websocketify_uri(http_uri) {
    return http_uri.replace(/^https?:\/\//i, 'ws://');
}
