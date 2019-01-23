from jinja2 import Environment, FileSystemLoader, select_autoescape
from gettext import NullTranslations
from os import path, environ


class Renderer:
    def __init__(self, translations: NullTranslations, default_values: dict = None):
        self.default_values = default_values or {}
        file_path = path.dirname(__file__)
        self.env = Environment(
            loader=FileSystemLoader(path.join(file_path, '../templates')),
            autoescape=select_autoescape(['html']),
            extensions=['jinja2.ext.i18n']
        )
        default_location = 'geoimagenetdev.crim.ca'
        self.env.install_gettext_translations(translations, True)
        self.add_global('SERVER_PROTOCOL', environ.get('SERVER_PROTOCOL') or 'https://')
        self.add_global('GEOSERVER_URL', environ.get('GEOSERVER_URL') or default_location)
        self.add_global('GEOIMAGENET_API_URL', environ.get('GEOIMAGENET_API_URL') or default_location + "/api/v1")
        self.add_global('ANNOTATION_NAMESPACE_URI', environ.get('ANNOTATION_NAMESPACE_URI') or 'geoimagenet.public.crim.ca')
        self.add_global('ANNOTATION_NAMESPACE', environ.get('ANNOTATION_NAMESPACE') or 'GEOIMAGENET_PUBLIC')
        self.add_global('ANNOTATION_LAYER', environ.get('ANNOTATION_LAYER') or 'annotation')
        pass

    def add_global(self, key, value):
        self.default_values[key] = value

    def render(self, template: str, values: dict = None):
        values = values or {}
        template = self.env.get_template(template)
        return template.render({**self.default_values, **values})
