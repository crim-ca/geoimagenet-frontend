// @flow strict

import type { MagpieResourceDictionary } from '../Types';
import { ProbablyInvalidPermissions } from './ProbablyInvalidPermissions';
import { Permission } from './Permission';

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
          const resource = resources[parseInt(resource_id, 10)];
          this.permissions[resource.resource_name] = (new Permission(resource));
        });

    }
  }
}
