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

    /**
     * @private
     * @type {Object}
     */
    repository;

    /**
     * @public
     * @readonly
     * @type {Boolean}
     * an user can have permissions to read some resources, while not being authentificated (mostly anonymous, tbqh)
     * hence, we originally use the authentificated boolean to control such flow, mostly the logged layout vs not logged layout
     * while this technically could be easily overwritten by the user on the client, we don't rely on this to actually
     * protect password protected resources.
     */
    authenticated;

    /**
     * @param {ResourcePermissionRepository} resource_permission_repository
     * @param {Boolean} authenticated
     */
    constructor(resource_permission_repository, authenticated = false) {
        this.repository = resource_permission_repository;
        this.authenticated = authenticated;
    }

    /**
     * Verifies a permission's existence in the permissions repository.
     * @param {String} permission_name
     * @param {String} resource
     * @returns {boolean}
     */
    can(permission_name, resource) {
        if (this.repository.permissions[resource]) {
            const permissions_on_resource = this.repository.permissions[resource].permission_names;
            return permissions_on_resource.indexOf(permission_name) !== -1;
        }
        return false;
    }
}
