from routes import Mapper
from GIN.Server import Handler
from GIN.View.Web import Models

mapper = Mapper()

mapper.connect('/', handler=Handler.Rendering, method='generate_markup_for_section', section='home')
mapper.connect('/models/{model_id}', handler=Models, method='handle')
mapper.connect('/models/{model_id}/request_download_url', handler=Models)
mapper.connect('/changelog', handler=Handler.Rst, method='send_rst_as_plain_text')
mapper.connect('/{section}', handler=Handler.Rendering, method='generate_markup_for_section')
