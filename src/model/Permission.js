// @flow strict

import type { MagpieResourceData } from '../Types';

/**
 * Frontend equivalent of a Magpie resource permission structure.
 * It expects to be fed with a single children value of the "resources" property of the
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
