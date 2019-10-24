// @flow strict

import type { Counts, FollowedUser, MagpieResourceData, MagpieResourceDictionary } from '../Types'

/**
 * This is the basic unit of annotation for machine learning: the class.
 * An class represents a thing that we want our model to recognize at some point.
 * We have properties stored in distant storage, as well as some other ones that represent the state of said taxonomy class within our application.
 */
export class TaxonomyClass {

  id: number
  name_fr: string
  name_en: string
  taxonomy_id: number
  parent_id: number | null
  children: TaxonomyClass[]
  /**
   * The visible property controls whether or not annotations, counts and any related information about that specific class are to be displayed.
   * There are a priori no exceptions to this rule, if anything anywhere is to be shown on the screen about a class, it should appear or not based on this property.
   */
  visible: boolean
  /**
   * In contrast to the visible property, the opened one is about the display of a class's children in the taxonomies and classes section of the sidebar
   */
  opened: boolean
  /**
   * Being "pinned" in the context of an annotation class is being present in the "workspace" of the annotation browser.
   * Pinned classes are present in a second screen where only pinned classes are present, so that the user can see a limited amount of information at the same time.
   */
  pinned: boolean
  counts: Counts

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
    pinned: boolean = false,
    counts: Counts = {}
  ) {
    this.id = id
    this.name_fr = name_fr
    this.name_en = name_en
    this.taxonomy_id = taxonomy_id
    this.parent_id = parent_id
    this.children = children
    this.visible = visible
    this.opened = opened
    this.pinned = pinned
    this.counts = counts
  }
}

export class AnnotationCounts {

}

/**
 * A taxonomy is an ensemble of TaxonomyClass that represents a specific field or subset of a field.
 */
export class Taxonomy {

  name_fr: string
  name_en: string
  slug: string
  versions: TaxonomyVersion[]

  constructor(name_fr: string, name_en: string, slug: string, versions: TaxonomyVersion[]) {

    this.name_fr = name_fr
    this.name_en = name_en
    this.slug = slug
    this.versions = versions
  }
}

/**
 * Taxonomies evolve in time; a taxonomy version groups all classes that correspond to a taxonomy at a point in time.
 */
export class TaxonomyVersion {

  taxonomy_id: number
  root_taxonomy_class_id: number
  version: string

  constructor(taxonomy_id: number, root_taxonomy_class_id: number, version: string) {

    this.taxonomy_id = taxonomy_id
    this.root_taxonomy_class_id = root_taxonomy_class_id
    this.version = version
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

  permissions = {}

  /**
   * Expects the value of the resources property of the /users/current/services/{service}/resources?inherit=true Magpie route.
   */
  constructor(resources: MagpieResourceDictionary | null = null) {
    if (resources !== null) {
      if (Object.getOwnPropertyNames(resources).length === 0) {
        throw new ProbablyInvalidPermissions('No permissions are defined in the resources for the frontend service. ' +
          'While this is possibly intended, it most probably means that there is a misconfiguration for your user. ' +
          'You will be unable to properly use the platform.')
      }
      Object.getOwnPropertyNames(resources)
        .forEach(resource_id => {
          const resource = resources[parseInt(resource_id)]
          this.permissions[resource.resource_name] = (new Permission(resource))
        })

    }
  }
}


/**
 * Frontend equivalent of a Magpie resource permission structure. It expects to be fed with a single children value of the "resources" property of the
 * /users/current/services/{service}/resources Magpie route.
 * @todo more tests: fetch live magpie permissions and make sure everything is correctly built and accessed
 */
export class Permission {

  resource_id: number
  resource_name: string
  resource_display_name: string
  permission_names: string[]
  parent_id: number
  root_service_id: number
  resource_type: string
  children: Permission[] = []

  constructor(resource: MagpieResourceData) {

    this.resource_id = resource.resource_id
    this.resource_name = resource.resource_name
    this.resource_display_name = resource.resource_display_name
    this.permission_names = resource.permission_names
    this.parent_id = resource.parent_id
    this.root_service_id = resource.root_service_id

    if (resource.children && Object.getOwnPropertyNames(resource.children).length > 0) {
      Object.getOwnPropertyNames(resource.children)
        .forEach(children_id => {
          const children = resource.children[parseInt(children_id)]
          this.children.push(new Permission(children))
        })
    }
    this.resource_type = resource.resource_type
  }
}

export class User {
  user_name: string
  email: string
  group_names: string[]
  id: number
  followed_users: FollowedUser[]

  constructor(user_name: string, email: string, group_names: string[], id: number, followed_users: FollowedUser[]) {
    this.user_name = user_name
    this.email = email
    this.group_names = group_names
    this.id = id
    this.followed_users = followed_users
  }
}

/**
 * While an annotation status is only a string and represents a status (yes), we need the actual state of that status across the platform.
 * This will in turn influence wether or not we see the counts, annotations, and actions (?) related to these annotation statuses.
 */
export class AnnotationFilter {
  /**
   * The status text, as seen from the api.
   */
  text: string
  /**
   * A human readable more beautiful text for the anotation status.
   */
  title: string
  /**
   * Wether this annotation status should be active all across the platfrom.
   */
  activated: boolean

  constructor(text: string, activated: boolean = false, title: string = '') {
    this.text = text
    this.activated = activated
    this.title = title
  }

}

type Sensor = 'PLEIADES';
type ImageExtension = '.tif' | '.png';
type Bits = 8 | 16;
type Bands = 'RGB' | 'NRG' | 'RGBN';

export class SatelliteImage {
  bands: Bands
  bits: Bits
  extension: ImageExtension
  filename: string
  id: number
  layer_name: string
  sensor_name: Sensor

  constructor(bands: Bands, bits: Bits, extension: ImageExtension, filename: string, id: number, layer_name: string, sensor_name: Sensor) {
    this.bands = bands
    this.bits = bits
    this.extension = extension
    this.filename = filename
    this.id = id
    this.layer_name = layer_name
    this.sensor_name = sensor_name
  }
}
