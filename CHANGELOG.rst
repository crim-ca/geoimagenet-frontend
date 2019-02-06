Changelog
=========

0.2.2
-----

New
~~~

- Saving image name with annotation
- Serve changelog as plain-text
- Show annotation counts
- Barebone selenium test script (not activated until docker installation is fixed)
- Validate and Reject annotations from frontend (directly writing the status)

Changes
~~~~~~~

- More notifications to guide user interactions

0.2.1 (2019-02-04)
------------------

New
~~~

- Release annotations
- Filter by annotation status in layer switcher
- Reduce docker image size [David Caron]

Changes
~~~~~~~

- Seven different colors in prevision for every annotation status

0.2.0 (2019-02-01)
------------------

New
~~~

- Hardcoded images lists
- Annotations statuses manually synced with API
- Show annotations by status from the layer switcher
- put external dependencies (mobx, ol) as local scripts
- Create, modify, delete annotations while in correct mode
- Mode toggled by correct action icons at the top

Changes
~~~~~~~

- Layer Switcher
  - List all images by type
  - One layer per image to allow for easier discovering of which image is being annotated
- remove api proxy and call api directly from frontend [David Caron]
- remove login and logout stubs until we know betetr how everything works together
- reduce docker image size [David Caron]

0.1.2 (2019-01-10)
------------------

New
~~~

- Backend
  - Standalone gunicorn app
    - Replace Flask before_request with gunicorn pre_request: parse cookies and validate session
    - Replace flask static with manual static file serving
  - Basic Dependency Injection Container with tests to automate the request handler creation and running
  - Reading environment variables to configure app

Changes
~~~~~~~

- Launch the app from docker through gunicorn instead of Flask
- Backend
  - Serve taxonomies from api instead of hardcoded ones
- Frontend
  - Toggling taxonomy elements open and close
  - Update hardcoded taxonomy to static files served from server
  - Recursive taxonomy generation function
  - Better fonts
  - Replicate some API changes
  - Only allow annotation of leafs

0.1.1 (2018-11-21)
------------------

Changes
~~~~~~~

- Only activate modification of features when a taxonomy class is selected
- Saving features and then reload the features
- Changing text to be in French first
- Removing login until it actually comes from Magpie

0.1 (2018-11-14)
----------------

New
~~~
- Prototypal application using a Flask dev server, jinja2 templating, openlayers with layer switcher from CDN
- Basic pages
  - presentation with logos and article
  - benchmarks
  - model download that allows the generation of a download url from a specific request
- Basic login with stub permissions
- Basic logged and not logged view
- Platform behind stubbed login
- Multi-browser safe favicons with some online favison generator
- Basic gettext i18n translation backbone
- Backend
  - Session controller that generates cooies for hardcoded user list
  - Rendering system around jinja2 with global values and integrated i18n translations
  - HTTP abstraction layer to instulate the app from http
- Frontend
  - Creating features and saving them to a PostGIS geoserver backend
  - Basic taxonomy browser from hardcoded
