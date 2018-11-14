from .Renderer import Renderer
from os import path
from gettext import GNUTranslations, NullTranslations


def make_renderer():
    script_path = path.dirname(__file__)
    fr_path = path.join(script_path, '../../locales/fr/LC_MESSAGES/fr.mo')
    with open(fr_path, 'r') as file:
        # translations = GNUTranslations(file)
        # TODO solve the wrong utf-8 encoding problem in the .mo files
        translations = NullTranslations()
        renderer = Renderer(translations, {
            'title': 'GeoImageNet',
        })
    return renderer
