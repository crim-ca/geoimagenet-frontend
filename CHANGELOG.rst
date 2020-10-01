Changelog
=========


1.8.1 (2020-10-01)
------------------
- Pull request #118: Feature/GEOIM-104 batch user creation. [Félix
  Gagnon-Grenier]

  Merge in GEO/frontend from feature/GEOIM-104-batch-user-creation to develop

  * commit '27a8ee13fc6a9a0a82f0f00666d1fd1e38f65585':
    removes the overflow from the body, duplicated scrollbars are lame
    GEOIM-104 - fixes reading the correct return code
    GEOIM-104 - shows batch user creation form only to those who can write users
    GEOIM-104 - fixes bad request errors on batch user creation and password change
    GEOIM-104 - adds a group selection to batch user creation
    GEOIM-104 - async account creation in its own function
    removes console.logs
    GEOIM-104 - naive batch create users
    GEOIM-281 - fix payload shape: data -> body
- Removes the overflow from the body, duplicated scrollbars are lame.
  [Félix Gagnon-Grenier]
- GEOIM-104 - fixes reading the correct return code. [Félix Gagnon-
  Grenier]
- GEOIM-104 - shows batch user creation form only to those who can write
  users. [Félix Gagnon-Grenier]
- GEOIM-104 - fixes bad request errors on batch user creation and
  password change. [Félix Gagnon-Grenier]
- GEOIM-104 - adds a group selection to batch user creation. [Félix
  Gagnon-Grenier]
- GEOIM-104 - async account creation in its own function. [Félix Gagnon-
  Grenier]
- Removes console.logs. [Félix Gagnon-Grenier]
- GEOIM-104 - naive batch create users. [Félix Gagnon-Grenier]
- GEOIM-281 - fix payload shape: data -> body. [Félix Gagnon-Grenier]
- Pull request #117: GEOIM-340 model documentation. [Francis Pelletier]

  Merge in GEO/frontend from GEOIM-340-model-documentation to develop

  * commit '1dbce8579e2589e145594f0af86a8784b1d4f0e4':
    Change dev to en in fallback languages
    Fix typo in model documentation
    Remove GridContainer
    Consolidate button placement with ButtonGrid
    Code styling
    Finalize help page for Model section
    Extract utility components to own files
    Add link to documentation on main page
    fix props + linting
    add basic content to helper page
    Update test for HelperPageButton + linting
    adds placeholder for internal help page
- Change dev to en in fallback languages. [pelletfr]
- Fix typo in model documentation. [pelletfr]
- Remove GridContainer. [pelletfr]
- Consolidate button placement with ButtonGrid. [pelletfr]
- Code styling. [pelletfr]
- Merge branch 'develop' of https://www.crim.ca/stash/scm/geo/frontend
  into GEOIM-340-model-documentation. [pelletfr]
- Pull request #116: Feature/GEOIM-281 changer mot passe. [Félix Gagnon-
  Grenier]

  Merge in GEO/frontend from feature/GEOIM-281-changer-mot-passe to develop

  * commit '0e0e294fa6ed5a77efc2f551a88a4f0495a56a94':
    fix import
    GEOIM-281 - basic change password form
    vulnerability packages update
    normalizing one column layout use
    fix undefined equality
- Fix import. [Félix Gagnon-Grenier]
- GEOIM-281 - basic change password form. [Félix Gagnon-Grenier]
- Vulnerability packages update. [Félix Gagnon-Grenier]
- Normalizing one column layout use. [Félix Gagnon-Grenier]
- Fix undefined equality. [Félix Gagnon-Grenier]
- Finalize help page for Model section. [pelletfr]
- Extract utility components to own files. [pelletfr]
- Add link to documentation on main page. [pelletfr]
- Fix props + linting. [pelletfr]
- Add basic content to helper page. [pelletfr]
- Update test for HelperPageButton + linting. [pelletfr]
- Adds placeholder for internal help page. [pelletfr]


1.8.0 (2020-06-11)
------------------
- Merge branch 'develop' of https://www.crim.ca/stash/scm/geo/frontend
  into develop. [pelletfr]
- Adds new tooltips and refactors. [pelletfr]
- Updates changelog and version. [pelletfr]
- Changelog update. [pelletfr]
- Merge branch 'develop' of https://www.crim.ca/stash/scm/geo/frontend
  into GEOIM-302-tooltips. [pelletfr]
- Adds tooltips to modes. [pelletfr]


1.7.2 (2020-05-08)
------------------
- Changes version. [pelletfr]
- Updates changelog. [pelletfr]
- Changes valid annotation resolution. [pelletfr]

  Reduces the valid resolution, and links that value to the
  VALID_OPENLAYERS_ANNOTATION_RESOLUTION constant,
  so creation is consistant with visualization, and can be
  changed accross the board easily.

  Eventually, it could also become something that can be
  changed by the users, right on the map.


1.7.1 (2020-05-05)
------------------
- Version 1.7.0 => 1.7.1. [pelletfr]
- Changelog update. [pelletfr]
- Fixes react-notifications icon problem. [pelletfr]

  Previous use of svgr/webpack for svg icons caused
  path problems for react-notifications, which caused
  a white rectangle to appear instead of regular icon

  Solution: Fixing path while using svgr was leading
  nowhere, so converted svg icons to png, and
  changed behavior of components accordingly
- Adds maxResolution rendering for annots. [pelletfr]
- Updates visuals for selectionToggle. [pelletfr]
- Changes mode constraints behavior. [pelletfr]
- Fixes missing translation link. [pelletfr]
- Updates tests for selection default changes. [pelletfr]
- Changes validation mode's default to selected. [pelletfr]
- Version update for package.json. [pelletfr]
- Makes small change to trigger Jenkins. [pelletfr]
- Merge branch 'develop' of https://www.crim.ca/stash/scm/geo/frontend
  into feature/GEOIM-305-menu-annotation-browser. [pelletfr]
- CHANGELOG. [pelletfr]
- Changes batch button to be disabled for non batch. [pelletfr]
- Moves map key to parent span. [pelletfr]
- Makes toggle pin change visibility. [pelletfr]
- ESLint rules ajustment. [pelletfr]
- Adds functions for release and validate actions. [pelletfr]
- Adjusts spacing and separation AnnotBrowser. [pelletfr]
- Simplifies and renames toggle widget. [pelletfr]
- Adds mode name to mode selector. [pelletfr]
- Restyles previously styled text from mainpage. [pelletfr]
- Removes obsolete tests. [pelletfr]
- ESLint. [pelletfr]
- Renames function to fit domain in use. [pelletfr]

  toggleAnnotatorIdentifiers => toggleAnnotationOwners
- Adds a necessary prop to AnnotationList. [pelletfr]
- ESLint. [pelletfr]


1.7.0 (2020-04-21)
------------------

Fix
~~~
- Feature creation. [Félix Gagnon-Grenier]
- Class selection. [Félix Gagnon-Grenier]

Other
~~~~~
- Fixed Contact menu element. [pelletfr]
- ESLint and link styling. [pelletfr]
- Updated documentation + utility script. [pelletfr]
- Generalized webpack for local dev. [pelletfr]
- Final touches to menu and layerswitcher. [pelletfr]
- ESLint and shorthand fix. [pelletfr]

  Using react shorthand <> instead of <React.Fragment>
  caused problems with ESDoc parsing
- Style of CheckboxLineInput changed to import theme. [pelletfr]

  withStyles caused a problem to Jest in testing on this component
  because it obfuscated the wanted child. Was simpler to change
  how FiberManualRecordIcon was styled, especially after reading
  that it could also cause problems outside of Jest.
- Changed Openlayers and coordinates box style. [pelletfr]
- ESLint. [pelletfr]
- Added colored icons to annotation filters. [pelletfr]
- Layerswitcher removed annotations. [pelletfr]
- ESLint rule to match code style in use. [pelletfr]
- Top menu color and renaming. [pelletfr]
- Positionning of OL elems + coordinates. [pelletfr]
- Platform: How To for grid positionning. [pelletfr]
- Linting. [pelletfr]
- Cleanup of anonymous functions. [pelletfr]
- New tests for LabelsContainer. [pelletfr]
- Partial linting and style cleanup. [pelletfr]
- Adding svg mock for Jest. [pelletfr]
- Changed LabelsChoices to Owners in tests. [pelletfr]
- Reconfig of OwnerIcon parameter. [pelletfr]
- Props destruct + new OwnersContainer. [pelletfr]
- LabelsChoice => Owners + switch to IconButton. [pelletfr]
- Added Labels IconButton. [pelletfr]
- Changed filters button to svg IconButton. [pelletfr]
- Changed webpack handling of svg format. [pelletfr]
- Modified eslint config to reflect style in use. [pelletfr]
- Added svg dependencies. [pelletfr]
- Dev: normalize global jsdom definitions. [Félix Gagnon-Grenier]
- Dev: GEOIM-316 - annotation component tests. [Félix Gagnon-Grenier]
- Usr: GEOIM-316 - some spacing with linting. [Félix Gagnon-Grenier]
- Usr: GEOIM-316 remove status in batch mode to see selection widget.
  [Félix Gagnon-Grenier]
- Usr: GEOIM-316 - select / deselect all. [Félix Gagnon-Grenier]
- Usr: GEOIM-316 - show checkbox for annotation selection. [Félix
  Gagnon-Grenier]
- Dev: GEOIM-316 - test for current page selection. [Félix Gagnon-
  Grenier]
- Dev: move store tests in a folder. [Félix Gagnon-Grenier]
- Usr: GEOIM-316 - show validation widget only in validation mode.
  [Félix Gagnon-Grenier]
- Dev: linting. [Félix Gagnon-Grenier]
- Usr: GEOIM-316 - annotation selection toggling. [Félix Gagnon-Grenier]
- Dev: linting. [Félix Gagnon-Grenier]
- Usr: GEOIM-316 - selection toggle for validation mode. [Félix Gagnon-
  Grenier]
- Dev: introducing template for webpack build. [Félix Gagnon-Grenier]
- Dev: changing docker build for better npm caching. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-305 - componentify annotation. [Félix Gagnon-Grenier]
- Fix session access for anon user. [Félix Gagnon-Grenier]
- Dev: observable user. [Félix Gagnon-Grenier]
- Dev: entities in their own files. [Félix Gagnon-Grenier]
- Dev: logged_user -> user. [Félix Gagnon-Grenier]
- Dev: fix followed users tests. [Félix Gagnon-Grenier]
- Usr: fix annotation filters labels. [Félix Gagnon-Grenier]
- Fix global fetch by getting autorun out of store. [Félix Gagnon-
  Grenier]
- Dev: testing filter selection restoration. [Félix Gagnon-Grenier]
- Dev: flow. [Félix Gagnon-Grenier]
- Usr: GEOIM-305 - deactivate unnecessary filters on mode change. [Félix
  Gagnon-Grenier]
- Dev: annotation status as its own mobx store. [Félix Gagnon-Grenier]
- Dev: fix + flow. [Félix Gagnon-Grenier]
- Dev: moving entities to the model. [Félix Gagnon-Grenier]
- Dev: move annotation filters in ui store. [Félix Gagnon-Grenier]
- Dev: normalizing data structures in store test. [Félix Gagnon-Grenier]
- Dev: moving stores into store folder. [Félix Gagnon-Grenier]
- Dev: much linting. very camelCased. such different. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-305 - correct icons. [Félix Gagnon-Grenier]
- Dev: fix color bug in newer OL version. [Félix Gagnon-Grenier]
- Dev: fix console warning. [Félix Gagnon-Grenier]
- Action buttons always on and linting. [Félix Gagnon-Grenier]
- Dev: GEOIM-305 - refactor mode selection in ui store. [Félix Gagnon-
  Grenier]
- Backtracking linter rudeness. [Félix Gagnon-Grenier]
- Linting followed users test. [Félix Gagnon-Grenier]
- Dev: stricter eslint. [Félix Gagnon-Grenier]
- Usr: GEOIM-288 - pin icon. [Félix Gagnon-Grenier]
- Usr: deactivate expertise feature. [Félix Gagnon-Grenier]
- Dev: make hmr work. [Félix Gagnon-Grenier]
- Dev: abstract fetch away from annotation browser store for easier
  testing. [Félix Gagnon-Grenier]
- Dev: run npm command inside docker. [Félix Gagnon-Grenier]
- Dev: no need from python based image anymore. [Félix Gagnon-Grenier]
- Typo. [David Caron]
- ForEachLayerAtPixel should return the topmost layer first. [David
  Caron]

  don't rely on z index, as it could be the same for 2 images
- Be a bit more explicit when filtering selection events. [David Caron]
- Don't import WKT from inside `user-interactions.js` (to make jest
  tests pass) [David Caron]
- Usr: fix bug where the draw interaction was added twice and multiple.
  [David Caron]

  error messages were shown
- Dev: fixes after refactoring. [David Caron]
- Dev: disable feature selection when the user is currently drawing.
  [David Caron]
- Dev: fix race condition bug where the style of an annotation can be
  ... [David Caron]

  requested and this annotation doesn't have a taxonomy_class_id yet
- Dev: show nodata limits on the map. [David Caron]
- Dev: refactor draw_condition_callback and sort layers by zIndex ...
  [David Caron]

  to find the top most layer
- Dev: query geoserver to know if an annotation is completely on an
  image. [David Caron]
- Dev: fix bug where `feature.revision_` wasn't reset to 0 in some
  cases. [David Caron]
- Dev: flow annotations. [Félix Gagnon-Grenier]
- Dev: parameterizing annotation thumbnail size. [Félix Gagnon-Grenier]
- Dev: GEOIM-288 - styling the components directly. [Félix Gagnon-
  Grenier]
- Usr: bugfixes for translation use in simple class context. [Félix
  Gagnon-Grenier]
- Run js tests. [Félix Gagnon-Grenier]
- Usr: GEOIM-288 - stop automatically marking classes as visible when
  pinning. [Félix Gagnon-Grenier]
- Removing python backend. [Félix Gagnon-Grenier]
- Introducing react router. [Félix Gagnon-Grenier]
- Usr: GEOIM-288 - move annotation actions inside annotation browser.
  [Félix Gagnon-Grenier]
- Usr: GEOIM-288 - translate annotation browser. [Félix Gagnon-Grenier]
- Usr: GEOIM-288 - ordering leaf class groups, improving path, visual
  improvements. [Félix Gagnon-Grenier]
- Dev: GEOIM-288 - basic breadcrumb. [Félix Gagnon-Grenier]
- Dev: GEOIM-288 - refactor for hoc taxonomy store. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-288 - automatically visualize class when pinning it. [Félix
  Gagnon-Grenier]
- Usr: GEOIM-288 - basic show pinned classesin annotation browser.
  [Félix Gagnon-Grenier]
- Dev: GEOIM-288 - move taxonomy classes toggling methods to taxonomy
  store. [Félix Gagnon-Grenier]
- Dev: GEOIM-288 - basic toggling of pinned state. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-288 - refactor flat taxonomy classes into taxonomy store.
  [Félix Gagnon-Grenier]
- Dev: GEOIM-288 - adding workspace container. [Félix Gagnon-Grenier]
- Dev: GEOIM-288 - add pinned property to frontend taxonomy class.
  [Félix Gagnon-Grenier]
- Dev: GEOIM-288 - refactoring taxonomy classes into taxonomy store.
  [Félix Gagnon-Grenier]


1.6.1 (2019-10-28)
------------------

Fix
~~~
- GEOIM-215 - boilerplate around anonymous session. [Félix Gagnon-
  Grenier]


1.6.0 (2019-10-03)
------------------
- Dev: leverage postinstall script instead of manually launching flow
  deps commands. [Félix Gagnon-Grenier]
- Dev: use compose for HOCs. [Félix Gagnon-Grenier]
- Nitpicking over comments. [Félix Gagnon-Grenier]
- Bump to 1.6.0. [Félix Gagnon-Grenier]
- Usr: set timeout for annotation selection on click to 1200 to allow
  slow transitions to still select the annotation. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-276 - automatically fill nickname map with logged user
  name, overridable with the list. [Félix Gagnon-Grenier]
- Usr: GEOIM-276 - showing nickname is possible. [Félix Gagnon-Grenier]
- Usr: GEOIM-276 - better meta information. [Félix Gagnon-Grenier]
- Bugfix: manually set annotator id on created annotations. [Félix
  Gagnon-Grenier]
- Usr: GEOIM-276 - meta information with the annotations. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-276 - select annotation on click. [Félix Gagnon-Grenier]
- Dev: GEOIM-276 - refactor selected features collection into open
  layers store. [Félix Gagnon-Grenier]
- Usr: GEOIM-276 - showing annotations over images. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-267 - fix scoping to keep followed users collection sync.
  [Félix Gagnon-Grenier]
- Usr: GEOIM-267 - traductions et couleur secondaire. [Félix Gagnon-
  Grenier]
- Dev: fixing jest configuration to ignore non test files when launching
  all tests. [Félix Gagnon-Grenier]
- Dev: fixing contextual menu test html element reference management.
  [Félix Gagnon-Grenier]
- Dev: tests & flow annotations. [Félix Gagnon-Grenier]
- Dev: some feature layers creation explanations. [Félix Gagnon-Grenier]
- Usr: GEOIM-267 - showing annotators nicknames or ids. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-267 - show users ids with labels. [Félix Gagnon-Grenier]
- Dev: no actual need for the ssl context. [Félix Gagnon-Grenier]
- Dev: GEOIM-267 - getter / setter for annotator label. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-267 - moving filters towards map. [Félix Gagnon-Grenier]
- Merge branch 'hotfix-1.5.1' into develop. [Félix Gagnon-Grenier]
- Usr: GEOIM-277 - move to annotation bounding box when clicking
  localize. [Félix Gagnon-Grenier]
- Dev: GEOIM-277 - inject view into map manager. [Félix Gagnon-Grenier]
- Usr: GEOIM-277 - localisation button. [Félix Gagnon-Grenier]
- Dev: fixing some tests. [Félix Gagnon-Grenier]
- Dev: GEOIM-275 - flow annotations. [Félix Gagnon-Grenier]
- Usr: GEOIM-275 - basic pagination. [Félix Gagnon-Grenier]
- Dev: GEOIM-275 - generating status filter cql in store. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-275 - barely working feature fetching with binding to
  taxonomy class selection. [Félix Gagnon-Grenier]


1.5.1 (2019-09-18)
------------------
- Dev: GEOIM-282 - fix delete content type header. [Félix Gagnon-
  Grenier]


1.5.0 (2019-09-16)
------------------

New
~~~
- GEOIM-254 - build the list from logged user to refresh features more
  easily after followed users crud. [Félix Gagnon-Grenier]
- GEOIM-254 - filtering annotations by ownership. [Félix Gagnon-Grenier]
- GEOIM-254 - simple popover where to put the filters. [Félix Gagnon-
  Grenier]
- GEOIM-282 - add translations. [Félix Gagnon-Grenier]
- GEOIM-282 - refresh list on followed user deletion. [Félix Gagnon-
  Grenier]
- GEOIM-282 - reload form when saving followed user with success. [Félix
  Gagnon-Grenier]
- GEOIM-282 - deleting user from list. [Félix Gagnon-Grenier]
- GEOIM-282 - followed users list. [Félix Gagnon-Grenier]
- GEOIM-282 - saving followed user. [Félix Gagnon-Grenier]
- GEOIM-282 - save followed user form. [Félix Gagnon-Grenier]
- GEOIM-109 - user information in settings section. [Félix Gagnon-
  Grenier]
- GEOIM-27 - centering contextual menu on mouse. [Félix Gagnon-Grenier]
- GEOIM-37 - exit contextual menu on outside click. [Félix Gagnon-
  Grenier]
- GEOIM-37 - contextual menu on the map to choose annotation. [Félix
  Gagnon-Grenier]
- GEOIM-37 - test for contextual menu. [Félix Gagnon-Grenier]
- GEOIM-37 - condition to let unambiguous feature selection events go
  correctly. [Félix Gagnon-Grenier]
- GEOIM-37 - very basic feature selection. [Félix Gagnon-Grenier]

Changes
~~~~~~~
- GEOIM-254 - move the coloured chips inside positioned layer switcher.
  [Félix Gagnon-Grenier]
- GEOIM-282 - label save -> add. [Félix Gagnon-Grenier]
- GEOIM-278 - activer filtres et classes lors de l'ajout. [Félix Gagnon-
  Grenier]
- GEOIM-37 - programatically select all features under click. [Félix
  Gagnon-Grenier]
- GEOIM-246 - warning user when modifying an annotation outside of its
  image. [Félix Gagnon-Grenier]
- GEOIM-246 - introduce checking stub for valid geometry on modifyend.
  [Félix Gagnon-Grenier]
- No need for react-scripts. [Félix Gagnon-Grenier]

Fix
~~~
- GEOIM-254 - cover edge case where there are no followed users. [Félix
  Gagnon-Grenier]
- GEOIM-246 - reset image when modifying it outside of its image. [Félix
  Gagnon-Grenier]
- GEOIM-268 - select first taxonomy by default for better positional
  relelvancy. [Félix Gagnon-Grenier]
- GEOIM-268 - adding fetching of data in presentation. [Félix Gagnon-
  Grenier]
- GEOIM-246 - move start interaction in user_interactions to remove
  dependency from interactions. [Félix Gagnon-Grenier]
- GEOIM-228 - test for annotation status toggling. [Félix Gagnon-
  Grenier]

Other
~~~~~
- Dev: GEOIM-282 - pr fixes. [Félix Gagnon-Grenier]
- Dev: GEOIM-282 - restructuring map utils tests. [Félix Gagnon-Grenier]
- Usr: remove all annotations when no selection. [Félix Gagnon-Grenier]
- Bumping version to 1.5.0. [Félix Gagnon-Grenier]
- Usr: GEOIM-282 - same label for followed users. [Félix Gagnon-Grenier]
- Dev: GEOIM-282 - testing add followed user form and list. [Félix
  Gagnon-Grenier]
- Dev: normalize wait function. [Félix Gagnon-Grenier]
- Usr: GEOIM-254 - toggle checkbox with label click. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-254 - extract component in filters. [Félix Gagnon-Grenier]
- Usr: GEOIM-254 - show nothing if no checkboxes are checked. [Félix
  Gagnon-Grenier]
- Usr: GEOIM-282 - add validation in followed user form. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-254 - fix typo on translation string. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-254 - fix null elemeent anchor warning. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-254 - translations. [Félix Gagnon-Grenier]
- Dev: GEOIM-254 - test for cql_ownership generation. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-254 - set primary color to turquoise-ish. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-254 - fix DOM construction error creating empty space in
  the bottom of the page. [Félix Gagnon-Grenier]
- Dev: GEOIM-254 - link ownership filters to the state. [Félix Gagnon-
  Grenier]
- Dev: GEOIM-254 - renaming stuff closer to domain. [Félix Gagnon-
  Grenier]
- Usr: GEOIM-254 - fading filters into view. [Félix Gagnon-Grenier]
- Dev: GEOIM-254 - moving annotation status filter to platform. [Félix
  Gagnon-Grenier]
- Dev: GEOIM-280 - capture problem when releasing annotations. [Félix
  Gagnon-Grenier]
- Dev: GEOIM-109 - flow annotations. [Félix Gagnon-Grenier]
- Dev: GEOIM-109 - flow annotations fixing undefined image case. [Félix
  Gagnon-Grenier]
- Dev: GEOIM-109 - extract data sections. [Félix Gagnon-Grenier]
- Dev: GEOIM-109 - extrait la sidebar de la plateforme, annotations
  flow. [Félix Gagnon-Grenier]
- Dev: GEOIM-37 - flow annotations. [Félix Gagnon-Grenier]
- Dev: GEOIM-27 - rename to resolve/reject for better semantics. [Félix
  Gagnon-Grenier]
- Dev: update material-ui. [Félix Gagnon-Grenier]
- Dev: GEOIM-268 - creating test for taxonomy in presentation. [Félix
  Gagnon-Grenier]
- Dev: GEOIM-268 - removing dependency on translation functions by using
  higher order components. [Félix Gagnon-Grenier]
- Dev: GEOIM-268 - removing superfluous create_state_proxy function with
  direct object construction. [Félix Gagnon-Grenier]
- Dev: GEOIM-268 - extract taxonomy component from the huge presentation
  spaghetti. [Félix Gagnon-Grenier]
- Dev: GEOIM-268 - retiré la dépendance sur le state_proxy dans le
  AnnotationCounts. [Félix Gagnon-Grenier]
- GEOIM-268 - extracting ListElement from Tree and distinction between
  PlatformListElement and PresentationListElement. [Félix Gagnon-
  Grenier]
- GEOIM-228 - toggle annotation by status only when changing annotation
  layer. [Félix Gagnon-Grenier]
- Merge branch 'release-1.4.0' into develop. [Félix Gagnon-Grenier]


1.4.2 (2019-08-22)
------------------
- Undo: annotation name as label. [David Caron]


1.4.0 (2019-08-16)
------------------

New
~~~
- GIL-229 - adding flowjs to refactor dom wrapping. [Félix Gagnon-
  Grenier]

Changes
~~~~~~~
- GEOIM-230 - refactoring notifier in material-ui standalone component.
  [Félix Gagnon-Grenier]

Fix
~~~
- GEOIM-257 - fix the tests not to import the actual op files. [Félix
  Gagnon-Grenier]
- Correct label for annotations. [Félix Gagnon-Grenier]
- GEOIM-72 - deleting an annotation should diminish the count by one.
  [Félix Gagnon-Grenier]
- Bring notifications styling back. [Félix Gagnon-Grenier]
- Prevent eternal loading in case of error while fetching taxonomies.
  [Félix Gagnon-Grenier]

Other
~~~~~
- GEOIM-79 - only show expertise request after certain resolution.
  [Félix Gagnon-Grenier]
- GEOIM-79 - simply add flag for review instead of refreshing the
  source. [Félix Gagnon-Grenier]
- Moving Dialogs in components. [Félix Gagnon-Grenier]
- Flow annotations. [Félix Gagnon-Grenier]
- GEOIM-79 - moving map interactions into their own class. [Félix
  Gagnon-Grenier]
- GEOIM-79 - adding styles to features to show a question mark. [Félix
  Gagnon-Grenier]
- GEOIM-235 - moving map components closer together. [Félix Gagnon-
  Grenier]
- GEOIM-79 - refactoring event handlers towards user interactions and
  flow annotations. [Félix Gagnon-Grenier]
- GEOIM-79 - use correct POST route for review request. [Félix Gagnon-
  Grenier]
- GEOIM-111 - fix hiding layers when deselecting them. [Félix Gagnon-
  Grenier]
- GEOIM-111 - moving annotation from new to deleted layer on deletion
  and tests. [Félix Gagnon-Grenier]
- GEOIM-111 - grouping map click handling by function. [Félix Gagnon-
  Grenier]
- GEOIM-111 - activating all layers up front. [Félix Gagnon-Grenier]
- GEOIM-111 - take taxonomy fetching out of selector for better testing.
  [Félix Gagnon-Grenier]
- GEOIM-211 - adding colors for all status chips. [Félix Gagnon-Grenier]
- GEOIM-111 - refactor taxonomy to test annotation counts. [Félix
  Gagnon-Grenier]
- GEOIM-197 - removing padding on sidebar paper. [Félix Gagnon-Grenier]
- GEOIM-240 - adding test to validate an error message. [Félix Gagnon-
  Grenier]
- GEOIM-175 - fixing status_message fields. [Félix Gagnon-Grenier]
- GEOIM-175 - corrected status_location to status_message for job log.
  [Félix Gagnon-Grenier]
- GEOIM-175 - some padding to plan for verbose error messages. [Félix
  Gagnon-Grenier]
- GEOIM-189 - wrapping graphql link to notify of errors. [Félix Gagnon-
  Grenier]
- GEOIM-34 - testing file upload. [Félix Gagnon-Grenier]
- GEOIM-34 - basic models page testing. [Félix Gagnon-Grenier]
- GEOIM-155 - working towards updating cache after mutation. [Félix
  Gagnon-Grenier]
- GEOIM-155 - polling when there are pending jobs in data. [Félix
  Gagnon-Grenier]
- GEOIM-34 - flow annotations. [Félix Gagnon-Grenier]
- GEOIM-72 - writing mobx action for annotion count decrement. [Félix
  Gagnon-Grenier]
- More documentation for dialog. [Félix Gagnon-Grenier]
- Improving dialogs flow acceptance with improved tests. [Félix Gagnon-
  Grenier]
- GEOIM-237 - flowjs in esdoc integration. [Félix Gagnon-Grenier]
- GEOIM-236 - types. [Félix Gagnon-Grenier]
- GEOIM-233 - component rendering test. [Félix Gagnon-Grenier]
- Refactor: using higher order components for graphql. [Félix Gagnon-
  Grenier]


1.3.3 (2019-07-15)
------------------

Fix
~~~
- GEOIM-221 - add necessary mimetypes to module before guessing types +
  massive unused code cleanup. [Félix Gagnon-Grenier]

Other
~~~~~
- Forgot unnecessary path navigation after moving files around. [Félix
  Gagnon-Grenier]
- Bumped version to 1.3.3 + changelog. [Félix Gagnon-Grenier]
- Test: GEOIM-221 - test for various filetypes. [Félix Gagnon-Grenier]
- Merge branch 'release-1.3.2' into develop. [Félix Gagnon-Grenier]


1.3.2 (2019-07-09)
------------------

New
~~~
- GEOIM-211 - traduction pluralisée des tooltips d'annotations. [Félix
  Gagnon-Grenier]
- GEOIM-211 adding basic tree view to the presentations taxonomy widget.
  [Félix Gagnon-Grenier]

Changes
~~~~~~~
- GEOIM-212 - add spacing to the close handle. [Félix Gagnon-Grenier]
- GEOIM-211 - open first taxonomy on loading taxonomy selector. [Félix
  Gagnon-Grenier]
- GEOIM-211 - fetching taxonomy classes when loading the page. [Félix
  Gagnon-Grenier]

Fix
~~~
- GEOIM-211 - inverted actual pluralization. [Félix Gagnon-Grenier]
- GEOIM-211 - bring colors for the front page. [Félix Gagnon-Grenier]

Other
~~~~~
- Merge branch 'release-1.3.2' [Félix Gagnon-Grenier]
- Bump version to 1.3.2. [Félix Gagnon-Grenier]
- GEOIM-211 - adding circular progress during taxonomy load. [Félix
  Gagnon-Grenier]
- GEOIM-211 injecting translation callback. [Félix Gagnon-Grenier]
- GEOIM-211 - crude translation of taxonomy classes labels. [Félix
  Gagnon-Grenier]


1.3.1 (2019-07-05)
------------------

New
~~~
- GEOIM-212 - clear icon to close dialogs. [Félix Gagnon-Grenier]

Fix
~~~
- GEOIM-215 switch for english. [Félix Gagnon-Grenier]

Other
~~~~~
- Bump version 1.3.1. [Félix Gagnon-Grenier]


1.3.0 (2019-07-05)
------------------

New
~~~
- GEOIM-202 - integrating presentation content from translated
  documents. [Félix Gagnon-Grenier]
- GEOIM-192 - links to pdf files and publications. [Félix Gagnon-
  Grenier]
- GEOIM-191 download taxonomy classes. [Félix Gagnon-Grenier]
- GEOIM-188 let non authenticated users see the platform without images.
  [Félix Gagnon-Grenier]
- GEOIM-187 logo from image. [Félix Gagnon-Grenier]
- GEOIM-187 contact link on home page. [Félix Gagnon-Grenier]

Changes
~~~~~~~
- Test to see if jenkins can build tags on master. [Félix Gagnon-
  Grenier]
- GEOIM-216 nouveaux collaborateurs. [Félix Gagnon-Grenier]
- GEOIM-192 - adding basic links for external publications. [Félix
  Gagnon-Grenier]
- GEOIM-158 take sentry dsn from environment. [Félix Gagnon-Grenier]
- Translating login message. [Félix Gagnon-Grenier]
- GEOIM-187 replace background. [Félix Gagnon-Grenier]
- GEOIM-187 hiding login in dialog. [Félix Gagnon-Grenier]
- GEOIM-187 reordering logos. [Félix Gagnon-Grenier]
- GEOIM-187 put language to the top. [Félix Gagnon-Grenier]
- Deploy develop as latest, use release for tags. [Félix Gagnon-Grenier]

Fix
~~~
- Typo. [Félix Gagnon-Grenier]
- GEOIM-213. [Félix Gagnon-Grenier]
- GEOIM-186 ease of use with material-ui dialogs. [Félix Gagnon-Grenier]
- Added correct contact mail in menu as well. [Félix Gagnon-Grenier]
- GEOIM-193 remove faulty code prevent background-color from changing.
  [Félix Gagnon-Grenier]

Other
~~~~~
- Bumped to version 1.3.0. [Félix Gagnon-Grenier]
- Benchmark text from mockup. [Félix Gagnon-Grenier]
- Ugly setting of unescaped html. [Félix Gagnon-Grenier]


1.2.0 (2019-06-26)
------------------

New
~~~
- GEOIM-185 benchmarks widget on home screen. [Félix Gagnon-Grenier]
- Introducing react-notifications for GEOIM-140. [Félix Gagnon-Grenier]

Changes
~~~~~~~
- Add wms layers attributions. [David Caron]
- GEOIM-179 deactivate expertise button until it's implemented. [Félix
  Gagnon-Grenier]
- Better benchmarks data. [Félix Gagnon-Grenier]
- More elegant public extension checking. [Félix Gagnon-Grenier]
- Refactoring apollo client creation to accept endpoint as param:
  testing benchmark component. [Félix Gagnon-Grenier]

Other
~~~~~
- Styling according to moqup. [Félix Gagnon-Grenier]
- Opening panels with specific sections on clicks. [Félix Gagnon-
  Grenier]
- Basic grid layout of new site. [Félix Gagnon-Grenier]
- Build and deploy all release branches. [Félix Gagnon-Grenier]
- Test: models page. [Félix Gagnon-Grenier]


1.1.0 (2019-06-17)
------------------

New
~~~
- Linking to external model upload preparation page. [Félix Gagnon-
  Grenier]
- Benchmarks page. [Félix Gagnon-Grenier]

Other
~~~~~
- Fallback on french, keep key if that's not defined. [Félix Gagnon-
  Grenier]
- Adding some default configuration for language detection. [Félix
  Gagnon-Grenier]
- Adding basic select field to change language. [Félix Gagnon-Grenier]
- Presentation in resource file. [Félix Gagnon-Grenier]
- Presentation component in react hook for easier use of i18n. [Félix
  Gagnon-Grenier]
- Dataset creation and job fetching in client functions instead of query
  and mutation components. [Félix Gagnon-Grenier]
- Catching 404 for the frontend service. [Félix Gagnon-Grenier]
- Corrected title typo. [Félix Gagnon-Grenier]
- Filtering only public benchmarks. [Félix Gagnon-Grenier]


1.0.0 (2019-06-11)
------------------

New
~~~
- Allow enter to launch login. [Félix Gagnon-Grenier]
- Upload file to graphql. [Félix Gagnon-Grenier]
- Datasets table from graphql endpoint. [Félix Gagnon-Grenier]

Fix
~~~
- Allow session handle not to break when permissions are not defined for
  the user. [Félix Gagnon-Grenier]

Other
~~~~~
- Actions to publish and unpublish benchmarks. [Félix Gagnon-Grenier]
- Better error wrapping around model testing jobs. [Félix Gagnon-
  Grenier]
- Showing model testing jobs and reloading after launch. [Félix Gagnon-
  Grenier]
- Feature flagged jobs subscriptions. [Félix Gagnon-Grenier]
- Basic mutate function from apollo client. [Félix Gagnon-Grenier]
- Fix jest testing. [Félix Gagnon-Grenier]
- Poor folks progress icon during model upload. [Félix Gagnon-Grenier]
- Using material-table. [Félix Gagnon-Grenier]
- Saving model with custom name. [Félix Gagnon-Grenier]
- Selenium is not the future of UI testing. [Félix Gagnon-Grenier]
- Installing the tests dependencies in test stage. [Félix Gagnon-
  Grenier]
- Dev vs tests requirements for easier jenkins test stage. [Félix
  Gagnon-Grenier]
- Package-lock from clean install. [Félix Gagnon-Grenier]
- Centralizing server code. [Félix Gagnon-Grenier]
- Jobs table for admin user. [Félix Gagnon-Grenier]


0.8.2 (2019-04-25)
------------------

Fix
~~~
- The pixelRatio must be explicitely set so ctrl-+ does not break tile
  sizes. [Félix Gagnon-Grenier]


0.8.0 (2019-04-23)
------------------

New
~~~
- Showing feature label from text style. [Félix Gagnon-Grenier]
- Private resources are not served for unauthenticated requests. [Félix
  Gagnon-Grenier]

Changes
~~~~~~~
- Toggle labels on and off. [Félix Gagnon-Grenier]
- Fix zIndex for annotations, after sorting images by date. [David
  Caron]
- Fix layer name. [David Caron]
- Load any layer containing the keyword 'GEOIMAGENET' don't ... [David
  Caron]

  filter based on a pre-configured list of workspaces
- Order layers based on date. [David Caron]
- Classify layers based on their keywords (RGB and NRG) [David Caron]
- Fix area size for EPSG:3857. [David Caron]
- Load tiles in their original projection: 3857. [David Caron]
- Fetching taxonomies in user interactions. [Félix Gagnon-Grenier]
- StoreActions in its own file. [Félix Gagnon-Grenier]

Fix
~~~
- Unwrapping promises. [Félix Gagnon-Grenier]
- Favicon should be on top public folder. [Félix Gagnon-Grenier]
- Actual correct background img path. [Félix Gagnon-Grenier]
- Remove superfluous promise wrapping to use native promises. [Félix
  Gagnon-Grenier]
- Actual logout when logout. [Félix Gagnon-Grenier]
- Serve images as public resources. [Félix Gagnon-Grenier]
- Notifications colors in all bundles. [Félix Gagnon-Grenier]

Other
~~~~~
- Some tidy. [Félix Gagnon-Grenier]
- Temp: working towards launching dataset creation. [Félix Gagnon-
  Grenier]
- Dev: putting the selected dataset in the global store. [Félix Gagnon-
  Grenier]


0.7.1 (2019-04-09)
------------------

Changes
~~~~~~~
- Datasets as table. [Félix Gagnon-Grenier]


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


