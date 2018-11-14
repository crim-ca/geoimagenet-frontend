class Benchmark:
    def __init__(self):
        self.store = [
            {'model': 'CMIP5', 'taxonomy_name': 'sols', 'taxonomy_version': 1.13, 'score': '95%', 'model_id': 123},
            {'model': 'CMIP5', 'taxonomy_name': 'sols', 'taxonomy_version': 0.92, 'score': '46%', 'model_id': 123},
            {'model': 'CMIP5', 'taxonomy_name': 'sols', 'taxonomy_version': 2.9, 'score': '99%', 'model_id': 123},
        ]
        pass

    def get_benchmarks(self):
        return self.store
