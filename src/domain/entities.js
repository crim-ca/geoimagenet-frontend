// @flow strict

import type {Counts, MagpieResourceData, MagpieResourceDictionary} from '../Types';

/**
 * This is the basic unit of annotation for machine learning: the class.
 * An class represents a thing that we want our model to recognize at some point.
 * We have properties stored in distant storage, as well as some other ones that represent the state of said taxonomy class within our application.
 */
export class TaxonomyClass {

    id: number;
    name_fr: string;
    name_en: string;
    taxonomy_id: number;
    parent_id: number | null;
    children: TaxonomyClass[];
    visible: boolean;
    opened: boolean;
    counts: Counts;

    /**
     * We only need four params from the api to make sure we have a class that will behave correctly in the application.
     * All others can be added after instantiation if they happen to exist.
     */
    constructor(
        id: number,
        name_fr: string,
        name_en: string,
        taxonomy_id: number,
        parent_id: number | null = null,
        children: TaxonomyClass[] = [],
        visible: boolean = false,
        opened: boolean = false,
        counts: Counts = {}
    ) {
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

export class AnnotationCounts {

}

/**
 * A taxonomy is an ensemble of TaxonomyClass that represents a specific field or subset of a field.
 */
export class Taxonomy {

    name_fr: string;
    name_en: string;
    slug: string;
    versions: TaxonomyVersion[];

    constructor(name_fr: string, name_en: string, slug: string, versions: TaxonomyVersion[]) {

        this.name_fr = name_fr;
        this.name_en = name_en;
        this.slug = slug;
        this.versions = versions;
    }
}

/**
 * Taxonomies evolve in time; a taxonomy version groups all classes that correspond to a taxonomy at a point in time.
 */
export class TaxonomyVersion {

    taxonomy_id: number;
    root_taxonomy_class_id: number;
    version: string;

    constructor(taxonomy_id: number, root_taxonomy_class_id: number, version: string) {

        this.taxonomy_id = taxonomy_id;
        this.root_taxonomy_class_id = root_taxonomy_class_id;
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

    permissions = {};

    /**
     * Expects the value of the resources property of the /users/current/services/{service}/resources?inherit=true Magpie route.
     */
    constructor(resources: MagpieResourceDictionary | null = null) {
        if (resources !== null) {
            if (Object.getOwnPropertyNames(resources).length === 0) {
                throw new ProbablyInvalidPermissions('No permissions are defined in the resources for the frontend service. ' +
                    'While this is possibly intended, it most probably means that there is a misconfiguration for your user. ' +
                    'You will be unable to properly use the platform.');
            }
            Object.getOwnPropertyNames(resources).forEach(resource_id => {
                const resource = resources[parseInt(resource_id)];
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

    resource_id: number;
    resource_name: string;
    resource_display_name: string;
    permission_names: string[];
    parent_id: number;
    root_service_id: number;
    resource_type: string;
    children: Permission[] = [];

    constructor(resource: MagpieResourceData) {

        this.resource_id = resource.resource_id;
        this.resource_name = resource.resource_name;
        this.resource_display_name = resource.resource_display_name;
        this.permission_names = resource.permission_names;
        this.parent_id = resource.parent_id;
        this.root_service_id = resource.root_service_id;

        if (resource.children && Object.getOwnPropertyNames(resource.children).length > 0) {
            Object.getOwnPropertyNames(resource.children).forEach(children_id => {
                const children = resource.children[parseInt(children_id)];
                this.children.push(new Permission(children));
            });
        }
        this.resource_type = resource.resource_type;
    }
}

export class User {
    user_name: string;
    email: string;
    group_names: string[];
    id: number;

    constructor(user_name: string, email: string, group_names: string[], id: number) {
        this.user_name = user_name;
        this.email = email;
        this.group_names = group_names;
        this.id = id;
    }
}

/**
 * While an annotation status is only a string and represents a status (yes), we need the actual state of that status across the platform.
 * This will in turn influence wether or not we see the counts, annotations, and actions (?) related to these annotation statuses.
 */
export class AnnotationStatusFilter {
    /**
     * The status text, as seen from the api.
     */
    text: string;
    /**
     * A human readable more beautiful text for the anotation status.
     */
    title: string;
    /**
     * Wether this annotation status should be active all across the platfrom.
     */
    activated: boolean;

    constructor(text: string, activated: boolean = false, title: string = '') {
        this.text = text;
        this.activated = activated;
        this.title = title;
    }

}

type Sensor = 'PLEIADES';
type ImageExtension = '.tif' | '.png';
type Bits = 8 | 16;
type Bands = 'RGB' | 'NRG' | 'RGBN';

export class SatelliteImage {
    bands: Bands;
    bits: Bits;
    extension: ImageExtension;
    filename: string;
    id: number;
    layer_name: string;
    sensor_name: Sensor;

    constructor(bands: Bands, bits: Bits, extension: ImageExtension, filename: string, id: number, layer_name: string, sensor_name: Sensor) {
        this.bands = bands;
        this.bits = bits;
        this.extension = extension;
        this.filename = filename;
        this.id = id;
        this.layer_name = layer_name;
        this.sensor_name = sensor_name;
    }
}
