import multiprocessing
import gunicorn.app.base
from gunicorn.six import iteritems

from Framework.Routing import mapper
from GIN.DependencyInjection.Injector import Injector

injector = Injector()


def handler_app(environ, start_response):

    method = environ['REQUEST_METHOD']
    path = environ['PATH_INFO']

    match = mapper.match(path, method)

    handler_instance = injector.make(match['handler'])
    handler_callable = getattr(handler_instance, match['method'])
    data = bytes(handler_callable(), 'utf8')

    status = '200 OK'
    response_headers = [
        ('Content-Type', 'text/html'),
    ]
    start_response(status, response_headers)
    return [data]


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
