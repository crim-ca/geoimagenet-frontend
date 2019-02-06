# GeoImageNet UI

Prototype for GeoImageNet UI
- public landing page with information about the project, benchmarks, etc.
- protected by login platform, with downloadable datasets, interactions with server

# Premise

The goal is to decouple the business domain from the framework being used.
Each framework should route requests to and responses from the GIN package.
Anything under `GIN/` should technically be agnostic of any framework.


# Installation

The dependencies are stored with `pip freeze > requirements.txt`, install these with `pip install -r requirements.txt`.

Launch the flask server with `FLASK_APP=Framework/flask_server.py flask run`.

Or directly the gunicorn app with `gunicorn -c Framework/gunicorn_config.py Framework:app -k eventlet`

## Environment variables

A few environment variables can be used to customize the behaviour of the client.

- SERVER_PROTOCOL: The protocol to be used for http requests from the client. Defaults to "https://".
- GEOSERVER_URL: The geoserver installation to be used for the client, *without* the /geoserver. Defaults to "geoimagenetdev.crim.ca".
- GEOIMAGENET_API_URL: Url to GeoImageNet api. Defaults to "geoimagenetdev.crim.ca/api/v1".
- ANNOTATION_NAMESPACE_URI: The geoserver namespace uri of the annotation data. Defaults to "geoimagenet.public.crim.ca".
- ANNOTATION_NAMESPACE: The geoserver namespace of the annotation data. Defaults to "GEOIMAGENET_PUBLIC".
- ANNOTATION_LAYER: The geoserver layer configured to accept annotations. Defaults to "annotation".

# Open Layers

I just copy pasted the ol-layerswitcher as it lacks the feature of being always visible.
If it gets possible to use the library and configure the layer switcher to stay open in the future,
maybe revisit this idea. For now I just implemented our needs from their code.

# Geoserver

Geoser needs the postgis extension to be enabled to support the postgis data stores needed to store the annotations.
On ubuntu `sudo apt install postgis`. Then, in the postgres cli, run `CREATE EXTENSION postgis;`.
You might need to connect to the postgres server using `sudo -u postgres psql annotations` to have sufficient permission to create extensions.
We also use uuids in the application, so install the relevant extension using `CREATE EXTENSION "uuid-ossp";`

By default, the installation of geoserver goes to `/usr/share/geoserver`. To start it cd into `/usr/share/geoserver/bin`
and run `sh startup.sh`. It should run on `localhost:8080/geoserver`

## Cors

To enable the CORS, needed for the client to interact with geoserver, follow the instructions seen 
[here](https://docs.geoserver.org/latest/en/user/production/container.html#enable-cors):

cd into `/usr/share/geoserver/webapps/geoserver/WEB-INF`, edit the config file `vim web.xml`,
uncomment the two filters tagged `<filter-name>cross-origin</filter-name>` then stop and restart the server.

## WFS-T

To support wfs treansactions:
- in WFS services settings, enable 'transactional' option (https://gis.stackexchange.com/a/141047/83943)
- in Data (security section) add a role for anonymous_role to write on the chosen feature type (in this example case, wfs_geom) (https://gis.stackexchange.com/a/258203/83943)

# Selenium

Follow installation instructions from official doc: make sure to install the drivers for desired browsers and make the symlink in /usr/bin/<driver>

# surface vs objet
le point avec rayon autour est surface
le carré being dragged est objet (instance)

# i18n

gettext is the de facto system for translatable strings. Using gettext and python conversion tools we can generate .mo files
needed for jinja2 i18n extension

To extract all translatable strings from templates files:

`
$ cd GIN/Templating
$ find . -iname "*.html" | xargs xgettext -L Python --from-code utf-8 -o fr.pot
`

This should find all .html template files (the only files in which we should see gettext invocations)
then run the xgettext command to extract translatable strings from them into fr.pot

Move them manually to locales/<lang>

# random

 - [Countries Bounding Boxes](https://gist.github.com/graydon/11198540)
 - [Getting started with PostGIS](https://docs.geoserver.org/latest/en/user/gettingstarted/postgis-quickstart/index.html)
