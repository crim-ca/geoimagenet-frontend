import inspect


class Injector:
    def __init__(self):
        self.cache = {}
        self.params = {}

    """
    Create and provision a desired type
    routine is passed a single argument that represents the type to be returned
    
    return cached instance if exists
    loop over constructor arguments
        if we have a param defined for it, assign it to the key and continue
        if it has a default, assign it to the key and continue
        if it has a type that is not built in, create the type with the injector, assign it to the key and continue
        raise exception
    """
    def make(self, desired_type):

        if desired_type in self.cache:
            return self.cache[desired_type]

        skippable_params = ['self', '/', 'args', 'kwargs']

        signature = inspect.signature(desired_type.__init__)
        arguments = {}
        for parameter, details in signature.parameters.items():
            if parameter in skippable_params:
                continue
            if parameter in self.params:
                arguments[parameter] = self.params[parameter]
                continue
            if details.default is not inspect._empty:
                arguments[parameter] = details.default
                continue
            arguments[parameter] = self.make(details.annotation)
            continue

        self.cache[desired_type] = desired_type(**arguments)
        return self.cache[desired_type]

    def define_param(self, name, value):
        self.params[name] = value
