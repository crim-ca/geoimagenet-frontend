from urllib.request import urlopen
import json


class Taxonomy:
    def __init__(self):
        pass

    def GET_taxonomy_by_id(self, taxonomy_id):
        with urlopen(f'https://geoimagenetdev.crim.ca/api/v1/taxonomy_classes/{taxonomy_id}') as content:
            return json.loads(content.read())

    def GET_all_taxonomies(self):
        with urlopen('https://geoimagenetdev.crim.ca/api/v1/taxonomy') as content:
            return json.loads(content.read())
