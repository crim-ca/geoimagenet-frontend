from GIN.Templating import Renderer
from os import path


def status_string(code, reason) -> str:
    return f'{code} {reason}'


def plain_text_200_response(content: str) -> [str, list, str]:
    return status_string(200, 'OK'), [('Content-Type', 'text/plain')], content


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


class Rst:

    def send_rst_as_plain_text(self) -> [str, list, str]:
        file_path = path.dirname(__file__)
        with open(path.join(file_path, '..', '..', 'CHANGELOG.rst')) as file:
            return plain_text_200_response(file.read())
