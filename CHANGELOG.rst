Changelog
=========


0.7.0 (2019-04-09)
------------------

New
~~~
- Switching layers from the map. [Félix Gagnon-Grenier]
- Basic session handle. [Félix Gagnon-Grenier]
- Login form on presentation screen. [Félix Gagnon-Grenier]
- Test for basic magpie permission structure. [Félix Gagnon-Grenier]
- Tooltip on annotation count hover. [Félix Gagnon-Grenier]
- Filter actions from permissions in magpie. [Félix Gagnon-Grenier]
- Multiple languages in data structures. [Félix Gagnon-Grenier]

Changes
~~~~~~~
- Load tiles while moving the map. [David Caron]
- Missing variable. [David Caron]
- Align tile requests to the cached tiles. [David Caron]
- Shinier presentation page. [Félix Gagnon-Grenier]

Fix
~~~
- Display counts at the end of the line. [Félix Gagnon-Grenier]

Other
~~~~~
- Some linting and test fixing. [Félix Gagnon-Grenier]
- Some documentation and tidy up. [Félix Gagnon-Grenier]
- Documenting constants. [Félix Gagnon-Grenier]


0.6.0 (2019-03-21)
------------------

Changes
~~~~~~~
- Build webpack at docker runtime to fix environment variables. [Félix
  Gagnon-Grenier]


0.5.1 (2019-03-20)
------------------

Fix
~~~
- Brought back top level hierarchy element. [Félix Gagnon-Grenier]


0.5.0 (2019-03-20)
------------------

New
~~~
- Datasets page layout. [Félix Gagnon-Grenier]
- Menu at the top of the logged in section. [Félix Gagnon-Grenier]
- Update new annotation count on annotation creation. [Félix Gagnon-
  Grenier]
- Sentry in frontend code. [Félix Gagnon-Grenier]
- Introduce sentry in python code. [Félix Gagnon-Grenier]
- Automatic doc generation with esdoc. [Félix Gagnon-Grenier]
- Adding MuiThemeProvider to material-ui. [Félix Gagnon-Grenier]

Changes
~~~~~~~
- Bringing back actual favicon. [Félix Gagnon-Grenier]
- Data queries in their own class. [Félix Gagnon-Grenier]
- Quick favicon fix until we remake the manifest and mobile behaviour
  thingy. [Félix Gagnon-Grenier]
- Taxonomy selection in tabs. [Félix Gagnon-Grenier]
- Sidebar sections in material panels. [Félix Gagnon-Grenier]
- Both flat and nested taxonomy_class structures with observables
  everywhere. [Félix Gagnon-Grenier]
- Select taxonomy with material effect. [Félix Gagnon-Grenier]
- Directly change properties on the class objects. [Félix Gagnon-
  Grenier]
- React component for taxonomy browser new: material-ui. [Félix Gagnon-
  Grenier]
- Better string formatting. [David Caron]
- Add bounding box to limit the WFS requests to geoserver. [David Caron]
- Docker builds faster, but image size is larger (250mb) [David Caron]
- Multiple bundles from webpack in dist folder. [Félix Gagnon-Grenier]

Fix
~~~
- Material-ui paper for presentation. [Félix Gagnon-Grenier]
- Show classes based on flat taxonomy_classes visible attribute. [Félix
  Gagnon-Grenier]
- Remove bundle from source control. [Félix Gagnon-Grenier]
- Don't focus element on opening list tree. [Félix Gagnon-Grenier]
- Serve static changelog file as utf-8. [Félix Gagnon-Grenier]

Other
~~~~~
- More MapManager doc. [Félix Gagnon-Grenier]


0.4.0 (2019-02-21)
------------------

New
~~~
- Zoom around features when multiple image in marker. [Félix Gagnon-
  Grenier]
- Keep previous mode stored when getting in and out of activated actions
  resolution. [Félix Gagnon-Grenier]
- Barebone react install. [Félix Gagnon-Grenier]
- Zoom on first feature in image marker on click. [Félix Gagnon-Grenier]
- Debounced activation of user actions on zoom level. [Félix Gagnon-
  Grenier]
- Testing with jest. [Félix Gagnon-Grenier]
- Webpack bundling. [Félix Gagnon-Grenier]

Changes
~~~~~~~
- Image marker layer from created images layer. [Félix Gagnon-Grenier]
- Refactor layer switcher in an actual class. [Félix Gagnon-Grenier]
- RGB and NRG layers toggling as group. [Félix Gagnon-Grenier]
- Coordinates in degrees. [Félix Gagnon-Grenier]
- Actions in their react component. [Félix Gagnon-Grenier]
- Center dialog and listen to esc and enter keys. [Félix Gagnon-Grenier]
- Show zommed in style for every image passed a certain resolution.
  [Félix Gagnon-Grenier]
- Back to es6 exporting. [Félix Gagnon-Grenier]
- Back to normal toggling of eyes. [Félix Gagnon-Grenier]
- Hide action icons in taxonomy browser when not needed. [Félix Gagnon-
  Grenier]

Fix
~~~
- Close dialog with confirm button. [Félix Gagnon-Grenier]
- GEOIM-73 listen to the proper click event. [Félix Gagnon-Grenier]

Other
~~~~~
- Actions in their component. [Félix Gagnon-Grenier]
- Zoome on img marker click. [Félix Gagnon-Grenier]
- Flat ancestors and descendants structure. [Félix Gagnon-Grenier]


0.3.0 (2019-02-12)
------------------

New
~~~
- Using gitchangelog. [Félix Gagnon-Grenier]

Changes
~~~~~~~
- Change route for annotation counts to: annotations/counts. [David
  Caron]

Other
~~~~~
- Bind rejection context. [Félix Gagnon-Grenier]
- Notmalizing data queries with async. [Félix Gagnon-Grenier]
- Update api usage urls. [Félix Gagnon-Grenier]
- Backtrack on false positive click prevention. [Félix Gagnon-Grenier]
- Linting. [Félix Gagnon-Grenier]
- See all data: center on canada, z=4. [Mario Beaulieu]
- Center on canada. [Mario Beaulieu]
- Correction rgb layer crs transform. [Mario Beaulieu]
- Prevent click when mouse have moved. [Félix Gagnon-Grenier]
- Try catch around geoserver access. [Félix Gagnon-Grenier]


0.2.2 (2019-02-07)
------------------

New
~~~
- Annotation + selenium. [Félix Gagnon-Grenier]

Other
~~~~~
- Changes for 0.2.2. [Félix Gagnon-Grenier]
- Adding scale line. [Félix Gagnon-Grenier]
- Cleanup: no more need for hardcoded image titles. [Félix Gagnon-
  Grenier]
- Linting and encapsulating requests. [Félix Gagnon-Grenier]
- Adding the actual setExtent call on RGB layers. [Félix Gagnon-Grenier]
- Temporary fix for clusters for overlayed NRG and RGB images. [David
  Caron]
- Show polygons over the images (so that the cluster numbers are
  visible) [David Caron]

  The images are not hidden, only overlayed by the cluster number
- Cluster bounding boxes and display count when zoomed out. [David
  Caron]
- Merge branch 'release' into dev-dynamic-raster-bbox. [David Caron]
- Display a rectangle for the bounding box of raster images. [David
  Caron]
- WIP, not working yet. [David Caron]
- Correction rgb layer names. [Mario Beaulieu]
- Remove make_layers as an independent function. [Mario Beaulieu]
- Add back make_layers to MapManager. [Mario Beaulieu]
- Readme correction. [Mario Beaulieu]
- First version to improve wms speed by adding layers extent. [Mario
  Beaulieu]
- New Validate + Reject notes. [Félix Gagnon-Grenier]
- Released annotation validation and rejection. [Félix Gagnon-Grenier]
- Opening tree on load. [Félix Gagnon-Grenier]
- Deactivating selenium until chrome driver's installation actually
  works. [Félix Gagnon-Grenier]
- Cleanup. [Félix Gagnon-Grenier]
- Super hacky unclear update of the counts while keeping tree opened
  after releasing. [Félix Gagnon-Grenier]
- Keeping opened structure on rerenders. [Félix Gagnon-Grenier]
- Function for xpath query. [Félix Gagnon-Grenier]
- Toggle class element in user interaction. [Félix Gagnon-Grenier]
- Updating count locally. [Félix Gagnon-Grenier]
- Visible mouse coordinates. [Félix Gagnon-Grenier]
- Some cleanup. [Félix Gagnon-Grenier]
- Actual test file. [Félix Gagnon-Grenier]
- Slightly working selenium test. [Félix Gagnon-Grenier]
- Queries in domain. [Félix Gagnon-Grenier]
- Xpath selector for parent. [Félix Gagnon-Grenier]
- Ugly prototypal counts. [Félix Gagnon-Grenier]
- Adding counts to taxonomy_classes. [Félix Gagnon-Grenier]
- Putting stuff in a specific user-interactions file. [Félix Gagnon-
  Grenier]
- Normalize checking checkboxes. [Félix Gagnon-Grenier]
- Rename taxonomy_class_root_id -> root_taxonomy_class_id. [David Caron]
- Notifications. [Félix Gagnon-Grenier]
- Close notification after 10 seconds. [Félix Gagnon-Grenier]
- Notification for user when no class is selected in creation mode.
  [Félix Gagnon-Grenier]
- Error when trying to create annotation without selected taxonomy
  class. [Félix Gagnon-Grenier]
- Cleaning. [Félix Gagnon-Grenier]
- Adding image name change. [Félix Gagnon-Grenier]
- Crude saving of the first layer under the click. [Félix Gagnon-
  Grenier]
- Route for changelog. [Félix Gagnon-Grenier]
- Specific error notification for 404. [Félix Gagnon-Grenier]
- Data for bing maps. [Félix Gagnon-Grenier]


0.2.1 (2019-02-04)
------------------
- Changelog embryo. [Félix Gagnon-Grenier]
- Minor cleaning up. [Félix Gagnon-Grenier]
- Adding css vars for layer colors in the future. [Félix Gagnon-Grenier]
- One filter per annotation status. [Félix Gagnon-Grenier]
- Collections, sources and layers in the store. [Félix Gagnon-Grenier]
- More async. [Félix Gagnon-Grenier]
- Insulate http queries in data-queries. [Félix Gagnon-Grenier]
- Redundant path component. [Félix Gagnon-Grenier]
- Release annotations by id. [Félix Gagnon-Grenier]
- Putting protocol in variables named as urls. [Félix Gagnon-Grenier]
- Reduce docker image by 50%: 95 Mb. [David Caron]


0.2.0 (2019-02-01)
------------------
- Update default structure with new property. [Félix Gagnon-Grenier]
- Remove unused code after calling api directly. [Félix Gagnon-Grenier]
- Adding dependencies locally until we fix cors concerns for dev. [Félix
  Gagnon-Grenier]
- Load external dependencies when cors are enabled as well. [Félix
  Gagnon-Grenier]
- More basemaps. [Félix Gagnon-Grenier]
- Each image in its own layer, hidden by default. [Félix Gagnon-Grenier]
- Constructor injection. [Félix Gagnon-Grenier]
- Highly prototrashypical base maps, annotations filters and images
  layer switcher. [Félix Gagnon-Grenier]
- Removing textual mode indicator; not in wireframe. [Félix Gagnon-
  Grenier]
- Images nrg in layer switcher. [Félix Gagnon-Grenier]
- Annotation statuses from api. [Félix Gagnon-Grenier]
- Don't show annotations if no classes are selected. [Félix Gagnon-
  Grenier]
- Basic section switcher for taxonomy vs layers. [Félix Gagnon-Grenier]
- Add fixme. [Félix Gagnon-Grenier]
- Eyes checked by default. [Félix Gagnon-Grenier]
- Array issue. /taxonomy_classes/{id} returns an object, not a list.
  [David Caron]
- Use make_http_request. [David Caron]
- Get taxonomy classes from rest api. [David Caron]
- Separate layers for released and new annotations. [Félix Gagnon-
  Grenier]
- Parameterizing layer creation. [Félix Gagnon-Grenier]
- Only show unreleased annotations in yellow. [Félix Gagnon-Grenier]
- Put release with annotations. [Félix Gagnon-Grenier]
- Use mobx to handle selection change. [Félix Gagnon-Grenier]
- Relative imports because modularity. [Félix Gagnon-Grenier]
- Putting visible classes in the store. [Félix Gagnon-Grenier]
- Passing release ids to map manager. [Félix Gagnon-Grenier]
- PUT on /annotations using a FeatureCollection... [David Caron]

  and split /annotation PUSH, PUT and DELETE functions
- Jenkins: only rebuild the frontend. [David Caron]
- Open at CRIM. [David Caron]
- Load images as tiles. [David Caron]
- Target geoserver Pleiades_RGB. [David Caron]
- Adding release button and basic handler. [Félix Gagnon-Grenier]
- Improving dom elements wrappers. [Félix Gagnon-Grenier]
- Removing feature from vector source after deleting it through wfs.
  [Félix Gagnon-Grenier]
- Fixes for feature id and updating using PUT request. [David Caron]
- Proper handling of non 200 requests. [Félix Gagnon-Grenier]
- Some colors. [Félix Gagnon-Grenier]
- Notifying user on request error. [Félix Gagnon-Grenier]
- Adapting code to geo json. [Félix Gagnon-Grenier]
- Add GEOIMAGENET_API_URL parameter. [David Caron]
- Insert and update in GeoJson. [David Caron]
- Slack to geoimagenet-dev. [Francis Charette Migneault]
- Basic confirm dialog. [Félix Gagnon-Grenier]
- Specific case for connection errors. [Félix Gagnon-Grenier]
- Deleting features. [Félix Gagnon-Grenier]
- First level is opened on loading the taxonomy. [Félix Gagnon-Grenier]
- Color for new features layer. [Félix Gagnon-Grenier]
- Cleanup. [Félix Gagnon-Grenier]
- Wait for map instanciation before adding or removing interactions.
  [Félix Gagnon-Grenier]
- Removing interactions when in improper mode. [Félix Gagnon-Grenier]
- Correct taxonomy class id. [Félix Gagnon-Grenier]
- Adding features when in creation mode with taxonomy class selected.
  [Félix Gagnon-Grenier]
- Selecting taxonomy class. [Félix Gagnon-Grenier]
- Update for multiple versions. [Félix Gagnon-Grenier]
- Centralise store. [Félix Gagnon-Grenier]
- Normalize member access. [Félix Gagnon-Grenier]
- Correctify name. [Félix Gagnon-Grenier]
- Adding action buttons. [Félix Gagnon-Grenier]
- Preparation for annotation counts. [Félix Gagnon-Grenier]
- Element creation helpers. [Félix Gagnon-Grenier]
- Proper cql filter name. [Félix Gagnon-Grenier]
- Absolute positionning of the map. [Félix Gagnon-Grenier]
- Toggling all visibility. [Félix Gagnon-Grenier]
- Aligning eyes. [Félix Gagnon-Grenier]
- Js modules. [Félix Gagnon-Grenier]
- Fix for updates. [David Caron]
- Add ANNOTATION_NAMESPACE_URI. [David Caron]
- Use /geoserver/wfs instead of /geoserver/GeoImageNet/wfs. [David
  Caron]
- First draft to support wfs inserts. works locally. [David Caron]
- Use .items() [David Caron]
- Basic debugging web server using werkzeug. [David Caron]
- Toggleable checkboxes with eye images. [Félix Gagnon-Grenier]
- Maybe fix the strange layout issue? [Félix Gagnon-Grenier]
- Output in slack channel #geoimagenet. [David Caron]
- Trigger Jenkins. [David Caron]
- Add Jenkinsfile. [David Caron]
- Add pytest and werkzeug (for development server) in
  requirements_dev.txt. [David Caron]
- Rename test.py to test_injector.py so that pytest finds it. [David
  Caron]
- Add gunicorn. [David Caron]
- Cleanup requirements. [David Caron]
- Docker: base image on alpine, use caching when re-building the image.
  [David Caron]
- Docker: add .dockerignore. [David Caron]
- Taxonomies from api. [Félix Gagnon-Grenier]
- Introducing le mobx. [Félix Gagnon-Grenier]
- Some bubbling of errors. [Félix Gagnon-Grenier]


0.1.2 (2019-01-10)
------------------
- Actual taxonomies from api. [Félix Gagnon-Grenier]
- Taxonomy_group -> taxonomy. [Félix Gagnon-Grenier]
- Some font. [Félix Gagnon-Grenier]
- Adapting docker to gunicorn config. [Félix Gagnon-Grenier]
- Some shinier. [Félix Gagnon-Grenier]
- Easing the use of api. [Félix Gagnon-Grenier]
- Only annotate leafs. [Félix Gagnon-Grenier]
- Toggling taxonomy elements. [Félix Gagnon-Grenier]
- Recursive taxonomy construction. [Félix Gagnon-Grenier]
- Testing injector, single handler for simple rendering. [Félix Gagnon-
  Grenier]
- Static taxonomies for now. [Félix Gagnon-Grenier]
- Environment variables into bundle. [Félix Gagnon-Grenier]
- Sections rendering. [Félix Gagnon-Grenier]
- Serving static files. [Félix Gagnon-Grenier]
- Testing some injector mechanic. [Félix Gagnon-Grenier]
- Barely working standalone gunicorn app. [Félix Gagnon-Grenier]
- Launching image with gunicorn. [Félix Gagnon-Grenier]
- Async workers. [Félix Gagnon-Grenier]
- Leveraging gunicorn pre_request. [Félix Gagnon-Grenier]


0.1 (2018-11-14)
----------------
- Application prototypale python d'annotation de features vers un
  datasource Geoserver PostGIS. [Félix Gagnon-Grenier]
- Release root. [Félix Gagnon-Grenier]


