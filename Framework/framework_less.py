import multiprocessing
import gunicorn.app.base
from os import path
from mimetypes import MimeTypes
from urllib.error import HTTPError
import sentry_sdk
from jinja2.exceptions import TemplateNotFound

from GIN.Server.Routing import mapper
from GIN.Server.Exception import NotFound
from GIN.DependencyInjection import Injector

mimetypes = MimeTypes()

sentry_sdk.init('https://855d6407dc424a5e95029d10600fbff5:7881d331c24c4c9187387c7845cfa0c3@sentry.crim.ca/20')


def make_full_file_path(request_uri):

    current_file_path = path.dirname(__file__)
    static_folder_path = path.join(current_file_path, '..', 'dist')
    return '%s%s' % (static_folder_path, request_uri)


def request_wants_file(full_file_path):

    return path.isfile(full_file_path)


# TODO as we get more sections, this will be a hassle to always update the equivalence
path_equivalences = {
    '/': '/index.html',
    '/docs': '/docs/index.html',
    '/docs/': '/docs/index.html',
    '/platform': '/platform.html',
    '/datasets': '/datasets.html',
}


def handler_app(environ, start_response):

    injector = Injector()
    request_method = environ['REQUEST_METHOD']
    request_uri = environ['PATH_INFO']

    if request_uri in path_equivalences:
        request_uri = path_equivalences[request_uri]

    full_file_path = make_full_file_path(request_uri)
    if request_wants_file(full_file_path):
        mime_type = mimetypes.guess_type(full_file_path)[0]
        with open(full_file_path, 'rb') as file:
            start_response('200 OK', [('Content-Type', mime_type)])
            return [file.read()]

    try:

        match = mapper.match(request_uri, request_method)

        if match is None:
            raise NotFound

        for key, value in match.items():
            injector.define_param(key, value)

        handler_instance = injector.make(match['handler'])
        handler_callable = getattr(handler_instance, match['method'])

        status, headers, data = injector.execute(handler_callable)

    except (NotFound, TemplateNotFound):
        status = '404 NOT FOUND'
        headers = [('Content-type', 'text/plain')]
        data = 'This page does not exist'
    except HTTPError as err:
        status = f'{err.code} {err.reason}'
        headers = [('Content-type', 'text/plain')]
        data = err.msg
    except ConnectionError:
        status = '500 CONNECTION REFUSED'
        headers = [('Content-type', 'text/plain')]
        data = 'The API is down at the moment. We could not fetch the resource.'
    except Exception as err:
        sentry_sdk.capture_exception(err)
        status = '500 SERVER ERROR'
        headers = [('Content-type', 'text/plain')]
        data = 'The server was unable to generate a response, and hopes you will pardon it.'

    start_response(status, headers)
    return [bytes(data, 'utf8')]


def number_of_workers():
    return (multiprocessing.cpu_count() * 2) + 1


class StandaloneApplication(gunicorn.app.base.BaseApplication):

    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super(StandaloneApplication, self).__init__()

    def load_config(self):
        config = dict([(key, value) for key, value in self.options.items()
                       if key in self.cfg.settings and value is not None])
        for key, value in config.items():
            self.cfg.set(key.lower(), value)

    def load(self):
        return self.application


if __name__ == '__main__':
    from werkzeug.serving import run_simple

    context = (
        "/projects/local-cert-generator/server.pem",
        "/projects/local-cert-generator/server.pem"
    )
    run_simple('0.0.0.0', 5000, handler_app, use_reloader=True)#, ssl_context=context)
