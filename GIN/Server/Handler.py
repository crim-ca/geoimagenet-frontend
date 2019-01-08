from GIN.Templating.Renderer import Renderer
from GIN.Model.Service.Taxonomy import Taxonomy
from json import dumps


class Rendering:

    def __init__(self, section: str, renderer: Renderer):
        self.section = section
        self.renderer = renderer
        pass

    def generate_markup_for_section(self) -> [str, list, str]:
        return '200 OK', [('Content-Type', 'text/html')], self.renderer.render('sections/%s.html' % self.section)


class API:

    def __init__(self, taxonomy_service: Taxonomy):
        self.taxonomy_service = taxonomy_service

    def GET_taxonomy(self) -> [str, list, str]:
        return '200 OK', [('Content-Type', 'application/json')], dumps(self.taxonomy_service.GET_all_taxonomies())

    def GET_taxonomy_by_name(self, name) -> [str, list, str]:
        return '200 OK', [('Content-Type', 'application/json')], dumps(self.taxonomy_service.GET_taxonomy(name))
