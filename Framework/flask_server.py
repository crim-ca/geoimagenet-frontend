from flask import Flask, request, make_response, redirect
from GIN.Server import Request as GINRequest
from GIN.Templating import renderer
from GIN.View import Web, Platform, Benchmarks, Models
from GIN.Controller import session_controller
from GIN.Model.Service import Benchmark as BenchmarkService
from GIN.Model.Entity import AnonymousPermission, LoggedInPermission
from os import path
from gettext import GNUTranslations, NullTranslations

web_view = Web(renderer)
benchmarks_view = Benchmarks(renderer, BenchmarkService())
platform_view = Platform(renderer)
models_view = Models(renderer)
app = Flask(__name__, static_url_path='', static_folder='../static')
permission = AnonymousPermission()


@app.before_request
def before_request():
    if 'session_id' in request.cookies:
        session_id = request.cookies['session_id'] or ''
        if session_controller.validate_session(session_id):
            permission = LoggedInPermission()
            renderer.add_global('logged_in', True)
            session = session_controller.session_store[session_id]
            renderer.add_global('user_name', session['user_name'])


@app.route('/')
def home():
    return web_view.handle()


@app.route('/benchmarks')
def benchmarks():
    return benchmarks_view.handle()


@app.route('/platform')
def platform():
    return platform_view.handle()


@app.route('/models/<model_id>')
def models(model_id: int):
    return models_view.handle(model_id)


@app.route('/models/<model_id>/request_download_url', methods=['POST'])
def generate_download_url(model_id: int):
    req = GINRequest(request.method, request.path, request.form)
    return models_view.receive_post(model_id, req)


@app.route('/login', methods=['POST'])
def login_request():
    # validate the login request
    user_name = request.form['user_name']
    if session_controller.validate_login(user_name, request.form['password']):
        # create cookie
        cookie = session_controller.create_session_cookie(user_name)
        # send cookie to client with redirect header
        response = make_response(redirect('/'))
        response.set_cookie('session_id', cookie)
        return response
    response = make_response()
    response.status_code = 401
    return response
