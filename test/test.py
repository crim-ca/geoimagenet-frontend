from GIN.DependencyInjection.Injector import Injector
from GIN.Templating.Renderer import Renderer
from GIN.Server.StaticHandler import StaticHandler
from os import path


class ValueObject:
    pass


class MixedParametersClass:
    def __init__(self, value_object: ValueObject, scalar_value):
        self.value_object = value_object
        self.scalar_value = scalar_value


def test_correctly_creates_types():
    injector = Injector()
    renderer = injector.make(Renderer)
    assert isinstance(renderer, Renderer)


def test_creates_object_with_typed_parameter_and_scalar():
    injector = Injector()
    scalar = 'scalar'
    injector.define_param('scalar_value', scalar)
    mixed_parameters_class = injector.make(MixedParametersClass)
    assert isinstance(mixed_parameters_class, MixedParametersClass)
    assert mixed_parameters_class.value_object is injector.make(ValueObject)
    assert mixed_parameters_class.scalar_value is scalar


def test_provisioned_instance():
    injector = Injector()
    renderer_1 = injector.make(Renderer)
    renderer_2 = injector.make(Renderer)
    assert renderer_1 is renderer_2


def test_static_handler_returns_file_content():
    injector = Injector()
    folder = path.dirname(__file__)
    static_content_folder = path.join(folder, 'test_data')
    injector.define_param('root_path', static_content_folder)
    static_handler = injector.make(StaticHandler)
    file_content = static_handler.serve_file(static_content_folder, 'txt', 'txt')
    assert type(file_content) is str
    assert file_content == 'content\n'
