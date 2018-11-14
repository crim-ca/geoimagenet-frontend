from GIN.Templating import Renderer


class Platform:
    def __init__(self, renderer: Renderer):
        self.render = renderer.render

    def handle(self):
        return self.render('sections/platform.html')
