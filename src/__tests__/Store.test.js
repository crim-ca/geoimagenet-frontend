const {MODE, ANNOTATION} = require('../domain/constants');
const {create_state_proxy, StoreActions} = require('../store');
const {action} = require('mobx');
const {TaxonomyClass} = require('../domain/entities');

const state_proxy = create_state_proxy();
const store_actions = new StoreActions(state_proxy);

test('injects a state_proxy and keeps track', () => {
    store_actions.set_mode(MODE.VISUALIZE);
    expect(state_proxy.mode).toBe(MODE.VISUALIZE);
    store_actions.set_mode(MODE.ASK_EXPERTISE);
    expect(state_proxy.mode).toBe(MODE.ASK_EXPERTISE);
});

test('builds flat taxonomy_classes list', () => {
    const sub_children = [
        {id: 4},
        {id: 5},
    ];
    const children = [
        {id: 2, name_fr: 'children name'},
        {
            id: 3,
            children: sub_children
        },
    ];
    const classes_from_api = {
        id: 1,
        children: children
    };
    store_actions.build_taxonomy_classes_structures(classes_from_api);
    expect(state_proxy.flat_taxonomy_classes[1]['children'][0]['name_fr']).toEqual('children name');
    expect(state_proxy.flat_taxonomy_classes[2]['name_fr']).toEqual('children name');
});

test('accessing flat classes changes nested ones', () => {
    const sub_children = [
        {id: 4},
        {id: 5},
    ];
    const children = [
        {id: 2},
        {
            id: 3,
            children: sub_children
        },
    ];
    const classes_from_api = {
        id: 1,
        children: children
    };
    store_actions.build_taxonomy_classes_structures(classes_from_api);
    action(() => {
        state_proxy.flat_taxonomy_classes[1]['name'] = 'test_name';
        expect(state_proxy.selected_taxonomy.elements[1]['name']).toEqual('test_name');
    });
});

describe('Managing annotation counts', () => {
    test('changing annotation counts actually changes annotation counts', () => {
        const store = create_state_proxy();
        const store_actions = new StoreActions(store);

        expect(store.flat_taxonomy_classes[1]).toBe(undefined);
        const taxonomy_class = new TaxonomyClass(1, 'name_fr', 'name_en', 1, null);

        const add_taxonomy = action(() => {
            store.flat_taxonomy_classes[1] = taxonomy_class;
        });
        add_taxonomy();

        expect(store.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW]).toBe(undefined);

        store_actions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, 1);
        expect(store.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW]).toBe(1);

        store_actions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, 2);
        expect(store.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW]).toBe(3);

        store_actions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, -4);
        expect(store.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW]).toBe(0);

        expect(() => {
            store_actions.change_annotation_status_count(1, 'undefined', 1);
        }).toThrow('undefined is not a status that is supported by our platform.');

        expect(() => {
            store_actions.change_annotation_status_count(-10, ANNOTATION.STATUS.NEW, 1);
        }).toThrow('Trying to change the counts of a non-existent taxonomy class.');

    });
});
