from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response
from GIN.Server import Request as GINRequest
from GIN.Templating import make_renderer
from GIN.View import Web, Platform, Benchmarks, Models
from GIN.Controller import Session as SessionController
from GIN.Model.Service import Benchmark as BenchmarkService
from GIN.Model.Entity import AnonymousPermission, LoggedInPermission
from os import path

renderer = make_renderer()

web_view = Web(renderer)
benchmarks_view = Benchmarks(renderer, BenchmarkService())
platform_view = Platform(renderer)
models_view = Models(renderer)
session_controller = SessionController({
    'admin': '$pbkdf2-sha512$25000$Y.wd41yLcS7l/F/r3dt7rw$/OqZfZw5I9EBcGtSfa2VN0uqdiQ4ZB0RdSiPukTwm6Yx0rr8xDy.jNDbQME1yoUs9A3k4N3nZ0yBQbwyIw8iQw'
})
permission = AnonymousPermission()


def home(request):
    return Response(web_view.handle())


def benchmarks(request):
    return Response(benchmarks_view.handle())


def platform(request):
    return Response(platform_view.handle())


def models(request):
    model_id = request.params['model_id']
    return Response(models_view.handle(model_id))


def generate_download_url(request):
    model_id = request.params['model_id']
    req = GINRequest(request.method, request.path, request.form)
    return Response(models_view.receive_post(model_id, req))


def login_request(request):
    # validate the login request
    user_name = request.POST['user_name']
    if session_controller.validate_login(user_name, request.POST['password']):
        # create cookie
        cookie = session_controller.create_session_cookie(user_name)
        # send cookie to client with redirect header
        response = Response(status=303)
        response.headers['location'] = '/'
        response.set_cookie('session_id', cookie)
        return response
    response = Response(status=401)
    return response


if __name__ == '__main__':
    with Configurator() as config:
        config.add_route('home', '/')
        config.add_route('benchmarks', '/benchmarks')
        config.add_route('platform', '/platform')
        config.add_route('models', '/models/{model_id}')
        config.add_route('generate_download_url', '/models/{model_id}/request_download_url', request_method='POST')
        config.add_route('login_request', '/login', request_method='POST')

        config.add_view(home, route_name='home')
        config.add_view(benchmarks, route_name='benchmarks')
        config.add_view(platform, route_name='platform')
        config.add_view(models, route_name='models')
        config.add_view(generate_download_url, route_name='generate_download_url')
        config.add_view(login_request, route_name='login_request')

        folder_path = path.dirname(__file__)
        static_path = path.join(folder_path, '../static')
        config.add_static_view(name='', path=static_path)

        app = config.make_wsgi_app()
    server = make_server('0.0.0.0', 5000, app)
    server.serve_forever()
