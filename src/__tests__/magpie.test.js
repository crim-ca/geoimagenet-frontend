const {Permission, ResourcePermissionRepository} = require('../domain/entities.js');
const {AccessControlList} = require('../domain/access-control-list.js');

test('Creates Permission from hardcoded data structure.', () => {
    const data_structure = {
        resource_id: 9,
        resource_name: 'res_name',
        resource_display_name: 'Resource name',
        resource_type: 'type',
        root_service_id: 9,
        parent_id: 9,
        permission_names: ['read'],
        children: {
            10: {
                resource_id: 10,
                resource_name: 'res_name',
                resource_display_name: 'Resource name',
                resource_type: 'type',
                root_service_id: 9,
                parent_id: 9,
                permission_names: ['read'],
                children: {},
            }
        },
    };
    const permission = new Permission(data_structure);
    expect(permission.resource_id).toBe(9);
    expect(permission.resource_name).toBe('res_name');
    expect(permission.resource_display_name).toBe('Resource name');
    expect(permission.resource_type).toBe('type');
    expect(permission.root_service_id).toBe(9);
    expect(permission.parent_id).toBe(9);
    expect(permission.permission_names).toEqual(['read']);
    expect(permission.children).toEqual([
        {
            resource_id: 10,
            resource_name: 'res_name',
            resource_display_name: 'Resource name',
            resource_type: 'type',
            root_service_id: 9,
            parent_id: 9,
            permission_names: ['read'],
            children: [],
        }
    ]);

    const children = permission.children[0];
    expect(children.resource_id).toBe(10);
});

test('Permissions correctly return true from the access control list.', () => {
    const acl = new AccessControlList(new ResourcePermissionRepository({
        9: {
            resource_name: 'datasets',
            permission_names: ['read'],
        }
    }));
    expect(acl.can('read', 'datasets')).toBe(true);
    expect(acl.can('write', 'datasets')).toBe(false);
    expect(acl.can('write', 'annotations')).toBe(false);
});
