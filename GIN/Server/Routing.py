from routes import Mapper
from GIN.DependencyInjection.Injector import Injector
from GIN.Server import Handler
from GIN.View.Web import Models

"""
web_view = Web(renderer)
benchmarks_view = Benchmarks(renderer, BenchmarkService())
platform_view = Platform(renderer)
models_view = Models(renderer)
app = Flask(__name__, static_url_path='', static_folder='../static')
permission = AnonymousPermission()
"""


mapper = Mapper()

"""
with Connection('dbname=annotations user=fractal password=1qaz2wsx') as connection:
    taxonomy = Taxonomy(connection)
    mapper.connect(None, '/api/taxonomy', controller=Taxonomy, action='get_taxonomies')

    match = mapper.match('/api/taxonomy')
    print(match)

    controller = match['controller'](connection)
    action = match['action']

    handler_callable = getattr(controller, action)
    result = handler_callable()
    print(result)
"""

mapper.connect('/', handler=Handler.Rendering, method='generate_markup_for_section', section='home')
mapper.connect('/{section}', handler=Handler.Rendering, method='generate_markup_for_section')
mapper.connect('/models/{model_id}', handler=Models, method='handle')
mapper.connect('/models/{model_id}/request_download_url', handler=Models)

injector = Injector()

"""
@app.route('/models/<model_id>/request_download_url', methods=['POST'])
@app.route('/login', methods=['POST'])
@app.route('/logout')
"""
