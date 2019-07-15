"""
We realized that the mime types (used to guess file types when serving static files) are dependent on the environment
when used from the built-in mimetypes package. That leads to problems with (for instance) stranger file types such as
.ttf or .woff, which would be unrecognized when launched in an environment where the relevant mime types are undefined
or unkown.

We should verify the environment supports the mime types needed for the application.
"""

from mimetypes import MimeTypes

mimetypes = MimeTypes()

supported_files_mapping = {
    'icons.ttf': ('application/font-sfnt', None),
    'icons.woff': ('application/font-woff', None),
    'thing.eot': ('application/vnd.ms-fontobject', None),
    'favicon.ico': ('image/vnd.microsoft.icon', None),
    'file.html': ('text/html', None),
    'file.js': ('application/javascript', None),
    'style.css': ('text/css', None),
    'img.jpg': ('image/jpeg', None),
    'img.svg': ('image/svg+xml', None),
    'img.png': ('image/png', None),
    'img.gif': ('image/gif', None),
}


def test_can_read_ttf_and_woff_files_mime_types():
    for file_name, result in supported_files_mapping.items():
        mime_type = mimetypes.guess_type(f'./test_data/filetypes/{file_name}')
        assert mime_type == result
