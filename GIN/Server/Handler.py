from GIN.Templating.Renderer import Renderer


class Rendering:

    def __init__(self, section, renderer: Renderer):
        self.section = section
        self.renderer = renderer
        pass

    def generate_markup_for_section(self):
        return '200 OK', [('Content-Type', 'text/html')], self.renderer.render('sections/%s.html' % self.section)
