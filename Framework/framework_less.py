import multiprocessing
import gunicorn.app.base
from gunicorn.six import iteritems
from os import path
from mimetypes import MimeTypes

from GIN.Server.Routing import mapper
from GIN.DependencyInjection import Injector

mimetypes = MimeTypes()


def make_full_file_path(request_uri):

    current_file_path = path.dirname(__file__)
    static_folder_path = path.join(current_file_path, '..', 'static')
    return '%s%s' % (static_folder_path, request_uri)


def request_wants_file(full_file_path):

    return path.isfile(full_file_path)


def handler_app(environ, start_response):

    injector = Injector()
    request_method = environ['REQUEST_METHOD']
    request_uri = environ['PATH_INFO']

    full_file_path = make_full_file_path(request_uri)
    if request_wants_file(full_file_path):
        mime_type = mimetypes.guess_type(full_file_path)[0]
        with open(full_file_path, 'rb') as file:
            start_response('200 OK', [('Content-Type', mime_type)])
            return [file.read()]

    match = mapper.match(request_uri, request_method)

    for key, value in match.items():
        injector.define_param(key, value)

    handler_instance = injector.make(match['handler'])
    handler_callable = getattr(handler_instance, match['method'])
    status, headers, data = injector.execute(handler_callable)

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
        config = dict([(key, value) for key, value in iteritems(self.options)
                       if key in self.cfg.settings and value is not None])
        for key, value in iteritems(config):
            self.cfg.set(key.lower(), value)

    def load(self):
        return self.application


if __name__ == '__main__':
    options = {
        'bind': '%s:%s' % ('0.0.0.0', '5000'),
        'workers': number_of_workers()
    }
    StandaloneApplication(handler_app, options).run()
