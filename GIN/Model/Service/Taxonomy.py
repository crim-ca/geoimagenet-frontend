from urllib.request import urlopen
import json


class Taxonomy:
    def __init__(self):
        pass

    def GET_taxonomy(self, taxonomy_name):
        with urlopen('https://geoimagenetdev.crim.ca/api/v1/taxonomy_classes?taxonomy_name=%s&depth=10&name=%s'
                     % (taxonomy_name, taxonomy_name)) as content:
            return json.loads(content.read())

    def GET_all_taxonomies(self):
        return ['Objets', 'SurfaceDeSols']
