from GIN.DependencyInjection.Injector import Injector
from GIN.Templating.Renderer import Renderer

injector = Injector()


def test_correctly_creates_types():
    renderer = injector.make(Renderer)
    assert isinstance(renderer, Renderer)


def test_provisioned_instance():
    renderer_1 = injector.make(Renderer)
    renderer_2 = injector.make(Renderer)
    assert renderer_1 is renderer_2
