from os import path
from mimetypes import MimeTypes
current_file_path = path.dirname(__file__)

gin_mimetypes = MimeTypes((path.join(current_file_path, '..', 'GIN', 'necessary_mimes.types'),))
