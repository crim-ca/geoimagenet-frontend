const {MODE} = require('./domain/constants');
const {create_state_proxy, StoreActions} = require('./domain/store');
const {action} = require('mobx');

const state_proxy = create_state_proxy();
const store_actions = new StoreActions(state_proxy);

test('injects a state_proxy and keeps track', () => {
    store_actions.set_mode(MODE.VISUALIZE);
    expect(state_proxy.mode).toBe(MODE.VISUALIZE);
});

test('builds nested and flat taxonomy_classes list', () => {
    const sub_children = [
        { id: 4 },
        { id: 5 },
    ];
    const children = [
        { id: 2 },
        {
            id: 3,
            children: sub_children
        },
    ];
    const classes_from_api = [
        {
            id: 1,
            children: children
        }
    ];
    store_actions.set_taxonomy_class(classes_from_api);
    expect(state_proxy.flat_taxonomy_classes[1]).toEqual(children);
    expect(state_proxy.flat_taxonomy_classes[3]).toEqual(sub_children);
    expect(state_proxy.selected_taxonomy.elements).toEqual(classes_from_api);
});

test('accessing flat classes changes nested ones', () => {
    const sub_children = [
        { id: 4 },
        { id: 5 },
    ];
    const children = [
        { id: 2 },
        {
            id: 3,
            children: sub_children
        },
    ];
    const classes_from_api = [
        {
            id: 1,
            children: children
        }
    ];
    store_actions.set_taxonomy_class(classes_from_api);
    action(() => {
        state_proxy.flat_taxonomy_classes[1]['name'] = 'test_name';
        expect(state_proxy.selected_taxonomy.elements[1]['name']).toEqual('test_name');
    });
});
