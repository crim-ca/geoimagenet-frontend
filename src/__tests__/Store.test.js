import { MuiThemeProvider } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { action } from 'mobx';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import { Container as LabelsContainer } from '../components/Map/LabelsChoice/Container';
import { TaxonomyStore } from '../store/TaxonomyStore';
import { UserInterfaceStore } from '../store/UserInterfaceStore';
import { Actions } from '../components/ModeSelection/Actions';
import { theme } from '../utils/react';
import {
  ANNOTATIONS,
  WRITE,
  MODE,
  ANNOTATION,
} from '../constants';
import { ui_store as uiStore } from '../store/instance_cache';
import { StoreActions } from '../store/StoreActions';
import { TaxonomyClass } from '../domain/entities';
import { GeoImageNetStore } from '../store/GeoImageNetStore';

const { window } = new JSDOM(`<!doctype html>`);

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);
configure({ adapter: new Adapter() });

const geoImageNetStore = new GeoImageNetStore();

describe('UI Elements correctly change the store', () => {
  test('Toggle annotators identifier off from default state', () => {
    const state_proxy = new GeoImageNetStore();
    const wrapper = mount(<LabelsContainer state_proxy={state_proxy} />);
    wrapper.simulate('click');
    expect(state_proxy.show_annotators_identifiers)
      .toBe(false);
  });
  test('Toggle annotators identifier on when state is already false', () => {
    const state_proxy = new GeoImageNetStore();
    state_proxy.toggle_annotator_identifiers(false);
    const wrapper = mount(<LabelsContainer state_proxy={state_proxy} />);
    wrapper.simulate('click');
    expect(state_proxy.show_annotators_identifiers)
      .toBe(true);
  });
});

describe('Artificially granted write annotations permissions', () => {

  test('By default there are no buttons', () => {
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Actions state_proxy={geoImageNetStore} />
      </MuiThemeProvider>,
    );
    expect(wrapper.find(FontAwesomeIcon).length)
      .toBe(0);
  });

  test('There are three buttons when we can write annotations', () => {
    geoImageNetStore.acl.repository.permissions[ANNOTATIONS] = {
      permission_names: [WRITE],
    };
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Actions state_proxy={geoImageNetStore} />
      </MuiThemeProvider>,
    );
    expect(wrapper.find(FontAwesomeIcon).length)
      .toBe(3);
  });

  test('We can activate delete mode from a button', () => {
    geoImageNetStore.acl.repository.permissions[ANNOTATIONS] = {
      permission_names: [WRITE],
    };
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Actions state_proxy={geoImageNetStore} />
      </MuiThemeProvider>,
    );
    wrapper.find(FontAwesomeIcon)
      .last()
      .simulate('click');
    expect(uiStore.selectedMode)
      .toBe(MODE.DELETE);
  });
});

describe('User interface store', () => {
  test('Default mode is visualize', () => {
    const customUiStore = new UserInterfaceStore();
    expect(customUiStore.selectedMode)
      .toBe(MODE.VISUALIZE);
  });

  test('We can change mode', () => {
    const customUiStore = new UserInterfaceStore();
    customUiStore.setMode(MODE.ASK_EXPERTISE);
    expect(customUiStore.selectedMode)
      .toBe(MODE.ASK_EXPERTISE);
  });

  test('Delete mode specific filters', () => {
    uiStore.setMode(MODE.DELETE);
    expect(geoImageNetStore.annotation_status_filters[ANNOTATION.STATUS.NEW].activated).toBe(true);
    expect(geoImageNetStore.annotation_status_filters[ANNOTATION.STATUS.RELEASED].activated).toBe(false);
    expect(geoImageNetStore.annotation_status_filters[ANNOTATION.STATUS.PRE_RELEASED].activated).toBe(false);
    expect(geoImageNetStore.annotation_status_filters[ANNOTATION.STATUS.VALIDATED].activated).toBe(false);
    expect(geoImageNetStore.annotation_status_filters[ANNOTATION.STATUS.REJECTED].activated).toBe(false);
    expect(geoImageNetStore.annotation_status_filters[ANNOTATION.STATUS.DELETED].activated).toBe(false);
  });
});

test('builds flat taxonomy_classes list', () => {
  const state_proxy = new GeoImageNetStore();
  const taxonomy_store = new TaxonomyStore(state_proxy);
  const store_actions = new StoreActions(state_proxy, taxonomy_store);
  const sub_children = [
    { id: 4 },
    { id: 5 },
  ];
  const children = [
    {
      id: 2,
      name_fr: 'children name'
    },
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
  expect(taxonomy_store.flat_taxonomy_classes[1]['children'][0]['name_fr'])
    .toEqual('children name');
  expect(taxonomy_store.flat_taxonomy_classes[2]['name_fr'])
    .toEqual('children name');
});

test('accessing flat classes changes nested ones', () => {
  const state_proxy = new GeoImageNetStore();
  const taxonomy_store = new TaxonomyStore(state_proxy);
  const store_actions = new StoreActions(state_proxy, taxonomy_store);
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
  const classes_from_api = {
    id: 1,
    children: children
  };
  store_actions.build_taxonomy_classes_structures(classes_from_api);
  action(() => {
    taxonomy_store.flat_taxonomy_classes[1]['children'][0]['name'] = 'test_name';
    expect(taxonomy_store.flat_taxonomy_classes[2]['name'])
      .toEqual('test_name');
  });
});

describe('Annotation counts', () => {
  test('changing annotation counts actually changes annotation counts', () => {
    const state_proxy = new GeoImageNetStore();
    const taxonomy_store = new TaxonomyStore(state_proxy);
    const store_actions = new StoreActions(state_proxy, taxonomy_store);

    expect(taxonomy_store.flat_taxonomy_classes[1])
      .toBe(undefined);
    const taxonomy_class = new TaxonomyClass(1, 'name_fr', 'name_en', 1, null);

    const add_taxonomy = action(() => {
      taxonomy_store.flat_taxonomy_classes[1] = taxonomy_class;
    });
    add_taxonomy();

    expect(taxonomy_store.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW])
      .toBe(undefined);

    store_actions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, 1);
    expect(taxonomy_store.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW])
      .toBe(1);

    store_actions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, 2);
    expect(taxonomy_store.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW])
      .toBe(3);

    store_actions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, -4);
    expect(taxonomy_store.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW])
      .toBe(0);

    expect(() => {
      store_actions.change_annotation_status_count(1, 'undefined', 1);
    })
      .toThrow('undefined is not a status that is supported by our platform.');

    expect(() => {
      store_actions.change_annotation_status_count(-10, ANNOTATION.STATUS.NEW, 1);
    })
      .toThrow('Trying to change the counts of a non-existent taxonomy class.');

  });
});

describe('Annotation visibility toggling.', () => {
  test('toggle_annotation_status_visibility refuses incorrect input.', () => {
    const state_proxy = new GeoImageNetStore();
    const taxonomy_store = new TaxonomyStore(state_proxy);
    const store_actions = new StoreActions(state_proxy, taxonomy_store);
    expect(() => {
      store_actions.toggle_annotation_status_visibility('not_a_real_status');
    })
      .toThrow('Invalid annotation status: [not_a_real_status]');
  });
  test('toggle_annotation_status_visibility toggles existent annotation status visibility', () => {
    const state_proxy = new GeoImageNetStore();
    const taxonomy_store = new TaxonomyStore(state_proxy);
    const store_actions = new StoreActions(state_proxy, taxonomy_store);
    const status = 'new';
    expect(state_proxy.annotation_status_filters[status].activated)
      .toBe(true);
    store_actions.toggle_annotation_status_visibility(status);
    expect(state_proxy.annotation_status_filters[status].activated)
      .toBe(false);
  });
});
