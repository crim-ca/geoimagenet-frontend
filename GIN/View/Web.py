from GIN.Server import Request
from GIN.Templating import Renderer
from GIN.Model.Service import Benchmark as BenchmarkService

available_sections = [
    'presentation',
    'benchmarks',
]


class View:
    def __init__(self, renderer: Renderer):
        self.renderer = renderer


class Web(View):
    def handle(self):
        return self.renderer.render('sections/presentation.html')


class Benchmarks(View):
    def __init__(self, renderer: Renderer, benchmark_service: BenchmarkService):
        super().__init__(renderer)
        self.benchmark_service = benchmark_service

    def handle(self):
        return self.renderer.render('sections/benchmarks.html', {
            'benchmarks': self.benchmark_service.get_benchmarks()
        })


class Models(View):
    def __init__(self, renderer: Renderer):
        super().__init__(renderer)
        self.store = []

    def handle(self, model_id: int):
        return self.renderer.render('sections/download_model.html', {
            'model_id': model_id
        })

    def receive_post(self, model_id: int, request: Request):
        if self.log_infos(request.params['nom'], request.params['compagnie'], request.params['courriel']):
            return 'url pour le téléchargement: {}'.format(model_id)
        else:
            return 'veuillez entrer des informations valides'

    def log_infos(self, name, company, email):
        self.store.append({
            'name': name,
            'company': company,
            'email': email,
        })
        return True
