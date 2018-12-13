import inspect


class Injector:
    def __init__(self):
        self.cache = {}

    """
    Create and provision a desired type
    
    inspect the desired type's constructor arguments
    
    if there are no arguments
        return the instantiated type
    
    loop over the arguments
        using the injector to create them
        add each of the results to a dict
    
    return the type passing it the dict
    """
    def make(self, desired_type):

        if desired_type in self.cache:
            return self.cache[desired_type]

        argument_specification = inspect.getfullargspec(desired_type.__init__)
        constructor_args = argument_specification[6]

        if constructor_args.__len__() is 0:
            return desired_type()

        params = []

        for constructor_arg_name in constructor_args:
            params.append(self.make(constructor_args[constructor_arg_name]))

        desired_instance = desired_type(*params)
        self.cache[desired_type] = desired_instance
        return desired_instance
