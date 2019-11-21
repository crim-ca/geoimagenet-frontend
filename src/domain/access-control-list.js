// @flow strict
import { ResourcePermissionRepository } from '../model/ResourcePermissionRepository';

/**
 * This class represents the actions an user can do in the platform. Certain buttons and interactions are dependant on
 * having permissions, that are to be configured in [Magpie](https://github.com/ouranosinc/magpie).
 *
 * The idea is to offer an api such as `if (acl->can(permission_name, resource)) { do stuff }`
 *
 * We consider the acl to be global to a specific session, it should be reloaded when user information changes
 * (at page load, at login and logout).
 *
 * @example
 * // get those constants from a central file
 * const READ = 'read';
 * const DATASETS = 'datasets';
 *
 * if (acl.can(READ, DATASETS) {}
 *
 * @todo write tests
 */

export class AccessControlList {

  repository: ResourcePermissionRepository;

  constructor(resource_permission_repository: ResourcePermissionRepository) {
    this.repository = resource_permission_repository;
  }

  /**
   * Verifies a permission's existence in the permissions repository.
   */
  can(permission_name: string, resource: string): boolean {
    if (this.repository.permissions[resource]) {
      const permissions_on_resource = this.repository.permissions[resource].permission_names;
      return permissions_on_resource.indexOf(permission_name) !== -1;
    }
    return false;
  }
}
