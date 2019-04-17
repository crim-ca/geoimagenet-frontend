/**
 * This is the basic unit of annotation for machine learning: the class.
 * An class represents a thing that we want our model to recognize at some point.
 * We have properties stored in distant storage, as well as some other ones that represent the state of said taxonomy class within our application.
 */
export class TaxonomyClass {
    /**
     * We only need four params from the api to make sure we have a class that will behave correctly in the application.
     * All others can be added after instantiation if they happen to exist.
     * @param {Number} id
     * @param {String} name_fr
     * @param {String} name_en
     * @param {Number} taxonomy_id
     * @param {Number|null} [parent_id=null]
     * @param {TaxonomyClass[]} [children=[]]
     * @param {boolean} [visible=false]
     * @param {boolean} [opened=false]
     * @param {Object} [counts={}]
     */
    constructor(id, name_fr, name_en, taxonomy_id, parent_id = null, children = [], visible = false, opened = false, counts = {}) {
        /**
         *
         * @type {Number}
         */
        this.id = id;
        /**
         *
         * @type {String}
         */
        this.name_fr = name_fr;
        /**
         *
         * @type {String}
         */
        this.name_en = name_en;
        /**
         *
         * @type {Number}
         */
        this.taxonomy_id = taxonomy_id;
        /**
         *
         * @type {Number}
         */
        this.parent_id = parent_id;
        /**
         *
         * @type {TaxonomyClass[]}
         */
        this.children = children;
        /**
         * The visibility of this class's annotations on the OpenLayers map.
         * @type {boolean}
         */
        this.visible = visible;
        /**
         * Wether or not the class's children classes are visible (toggled) in the taxonomy browser.
         * @type {boolean}
         */
        this.opened = opened;
        /**
         *
         * @type {Object}
         */
        this.counts = counts;
    }
}

export class Dataset {
    /**
     *
     * @param {Number} id
     * @param {String} created
     * @param {Number} classes
     * @param {Number} annotations
     */
    constructor(id, created, classes, annotations) {
        /**
         *
         * @type {Number}
         */
        this.id = id;
        /**
         *
         * @type {String}
         */
        this.created = created;
        /**
         *
         * @type {Number}
         */
        this.classes = classes;
        /**
         *
         * @type {Number}
         */
        this.annotations = annotations;
    }
}

export class AnnotationCounts {

}

/**
 * A taxonomy is an ensemble of TaxonomyClass that represents a specific field or subset of a field.
 */
export class Taxonomy {
    /**
     * @param {String} name_fr
     * @param {String} name_en
     * @param {String} slug a unique identifier for the taxonomy
     * @param {TaxonomyVersion[]} versions
     */
    constructor(name_fr, name_en, slug, versions) {
        /**
         *
         * @type {String}
         */
        this.name_fr = name;
        /**
         *
         * @type {String}
         */
        this.name_en = name;
        /**
         *
         * @type {String}
         */
        this.slug = slug;
        /**
         *
         * @type {TaxonomyVersion[]}
         */
        this.versions = versions;
    }
}

/**
 * Taxonomies evolve in time; a taxonomy version groups all classes that correspond to a taxonomy at a point in time.
 */
export class TaxonomyVersion {
    /**
     *
     * @param {Number} taxonomy_id
     * @param {Number} root_taxonomy_class_id the topmost class of this version
     * @param {String} version
     */
    constructor(taxonomy_id, root_taxonomy_class_id, version) {
        /**
         *
         * @type {Number}
         */
        this.taxonomy_id = taxonomy_id;
        /**
         *
         * @type {Number}
         */
        this.root_taxonomy_class_id = root_taxonomy_class_id;
        /**
         *
         * @type {String}
         */
        this.version = version;
    }
}

export class InvalidPermissions extends Error {
}

export class ProbablyInvalidPermissions extends Error {
}

/**
 * Group permissions for a given magpie resource.
 */
export class ResourcePermissionRepository {

    /**
     * @type {Object<Number, Permission>}
     */
    permissions = {};

    /**
     * @param {Object} [resources=null] Expects the value of the resources property of the /users/current/services/{service}/resources Magpie route.
     */
    constructor(resources = null) {
        if (resources !== null) {
            if (Object.getOwnPropertyNames(resources).length === 0) {
                throw new ProbablyInvalidPermissions('No permissions are defined in the resources for the frontend service. ' +
                    'While this is possibly intended, it most probably means that there is a misconfiguration for your user. ' +
                    'You will be unable to properly use the platform.');
            }
            Object.getOwnPropertyNames(resources).forEach(resource_id => {
                const resource = resources[resource_id];
                this.permissions[resource.resource_name] = (new Permission(resource));
            });

        }
    }
}


/**
 * Frontend equivalent of a Magpie resource permission structure. It expects to be fed with a single children value of the "resources" property of the
 * /users/current/services/{service}/resources Magpie route.
 * @todo more tests: fetch live magpie permissions and make sure everything is correctly built and accessed
 */
export class Permission {

    /**
     * @type {Permission[]}
     */
    children = [];

    constructor(resource) {

        /**
         * @type {Number}
         */
        this.resource_id = resource.resource_id;
        /**
         * @type {String}
         */
        this.resource_name = resource.resource_name;
        /**
         * @type {String}
         */
        this.resource_display_name = resource.resource_display_name;
        /**
         * @type {String[]}
         */
        this.permission_names = resource.permission_names;
        /**
         * @type {Number}
         */
        this.parent_id = resource.parent_id;
        /**
         * @type {Number}
         */
        this.root_service_id = resource.root_service_id;

        if (resource.children && Object.getOwnPropertyNames(resource.children).length > 0) {
            Object.getOwnPropertyNames(resource.children).forEach(children_id => {
                const children = resource.children[children_id];
                this.children.push(new Permission(children));
            });
        }
        /**
         * @type {String}
         */
        this.resource_type = resource.resource_type;
    }
}

/**
 * User entity.
 */
export class User {
    /**
     *
     * @param {String} user_name
     * @param {String} email
     * @param {String[]} group_names
     */
    constructor(user_name, email, group_names) {
        /**
         * @type {String}
         */
        this.user_name = user_name;
        /**
         * @type {String}
         */
        this.email = email;
        /**
         * @type {String[]}
         */
        this.group_names = group_names;
    }
}

/**
 * While an annotation status is only a string and represents a status (yes), we need the actual state of that status across the platform.
 * This will in turn influence wether or not we see the counts, annotations, and actions (?) related to these annotation statuses.
 */
export class AnnotationStatus {
    /**
     * The status text, as seen from the api.
     * @type {String}
     */
    text;
    /**
     * A human readable more beautiful text for the anotation status.
     * @type {String}
     */
    title;
    /**
     * Wether this annotation status should be active all across the platfrom.
     * @type {Boolean}
     */
    activated;

    /**
     *
     * @param {String} text
     * @param {Boolean} [activated=false]
     * @param {String} [title='']
     */
    constructor(text, activated=false, title = '') {
        this.text = text;
        this.activated = activated;
        this.title = title;
    }

}
