from GIN.Templating import Renderer
from GIN.Model.Service.Taxonomy import Taxonomy
from json import dumps


def status_string(code, reason) -> str:
    return f'{code} {reason}'


def json_200_response(content: str) -> [str, list, str]:
    return status_string(200, 'OK'), [('Content-Type', 'application/json')], content


def html_200_response(content: str) -> [str, list, str]:
    return status_string(200, 'OK'), [('Content-Type', 'text/html')], content


class Rendering:

    def __init__(self, section: str, renderer: Renderer):
        self.section = section
        self.renderer = renderer
        pass

    def generate_markup_for_section(self) -> [str, list, str]:
        return html_200_response(self.renderer.render('sections/%s.html' % self.section))


class API:

    def __init__(self, taxonomy_service: Taxonomy):
        self.taxonomy_service = taxonomy_service

    def GET_taxonomy(self) -> [str, list, str]:
        return json_200_response(dumps(self.taxonomy_service.GET_all_taxonomies()))

    def GET_taxonomy_by_id(self, taxonomy_id) -> [str, list, str]:
        return json_200_response(dumps([self.taxonomy_service.GET_taxonomy_by_id(taxonomy_id)]))
