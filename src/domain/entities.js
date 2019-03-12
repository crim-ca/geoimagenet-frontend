/**
 * This is the basic unit of annotation for machine learning: the class.
 * An class represents a thing that we want our model to recognize at some point.
 * We have properties stored in distant storage, as well as some other ones that represent the state of said taxonomy class within our application.
 */
export class TaxonomyClass {
    /**
     *
     * @param {Number} id
     * @param {string} name
     * @param {Number} taxonomy_id
     * @param {TaxonomyClass[]} children
     * @param {Number|null} parent_id
     * @param {boolean} visible The visibility of this class annotations in the viewport
     * @param {boolean} opened Wether or not the class's children are visible in the viewport
     * @param {Object} counts
     */
    constructor(id, name, taxonomy_id, parent_id = null, children = [], visible = false, opened = false, counts = {}) {
        /**
         *
         * @type {Number}
         */
        this.id = id;
        /**
         *
         * @type {string}
         */
        this.name = name;
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
         *
         * @type {boolean}
         */
        this.visible = visible;
        /**
         *
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

/**
 * A taxonomy is an ensemble of TaxonomyClass that represents a specific field or subset of a field.
 */
export class Taxonomy {
    /**
     *
     * @param {string} name a unique identifier for the taxonomy
     * @param {string} slug
     * @param {TaxonomyVersion[]} versions
     */
    constructor(name, slug, versions) {
        /**
         *
         * @type {string}
         */
        this.name = name;
        /**
         *
         * @type {string}
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
     * @param {string} version
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
         * @type {string}
         */
        this.version = version;
    }
}
