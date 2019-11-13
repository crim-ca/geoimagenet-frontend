// @flow strict
import type { FollowedUser, MagpieResourceData, MagpieResourceDictionary } from '../Types';

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
      Object.getOwnPropertyNames(resources)
        .forEach(resource_id => {
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
      Object.getOwnPropertyNames(resource.children)
        .forEach(children_id => {
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

  followed_users: FollowedUser[];

  constructor(user_name: string, email: string, group_names: string[], id: number, followed_users: FollowedUser[]) {
    this.user_name = user_name;
    this.email = email;
    this.group_names = group_names;
    this.id = id;
    this.followed_users = followed_users;
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
