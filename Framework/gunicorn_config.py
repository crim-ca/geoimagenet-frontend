from GIN.Controller import Session
from GIN.Templating import Renderer
from GIN.DependencyInjection import default_injector
from http.cookies import SimpleCookie

bind = "0.0.0.0:5000"
workers = 1


def parse_cookies(request):
    headers = dict(request.headers)
    if 'COOKIE' in headers:
        cookie = SimpleCookie()
        cookie.load(headers['COOKIE'])
        cookies = {}
        for key, morsel in cookie.items():
            cookies[key] = morsel.value
        return cookies
    return {}


def pre_request(worker, request):
    cookies = parse_cookies(request)
    session_controller = default_injector.make(Session)
    renderer = default_injector.make(Renderer)
    if 'session_id' in cookies:
        session_id = cookies['session_id'] or ''
        if session_controller.validate_session(session_id):
            renderer.add_global('logged_in', True)
            session = session_controller.session_store[session_id]
            renderer.add_global('user_name', session['user_name'])
