import pytest

from GIN.DependencyInjection.Injector import Injector
from GIN.Templating.Renderer import Renderer
from GIN.Server import Handler


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


def test_creates_rendering_handler():
    injector = Injector()
    rendering_handler = injector.make(Handler.Rendering)
    assert isinstance(rendering_handler, Handler.Rendering)


def test_making_a_module_throws_exception():
    injector = Injector()
    with pytest.raises(RuntimeError):
        injector.make(Handler)
