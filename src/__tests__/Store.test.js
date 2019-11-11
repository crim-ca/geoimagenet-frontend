import { MuiThemeProvider } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { action } from 'mobx';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import { Container as LabelsContainer } from '../components/Map/LabelsChoice/Container';
import { TaxonomyStore } from '../model/store/TaxonomyStore';
import { UserInterfaceStore } from '../model/store/UserInterfaceStore';
import { Actions } from '../components/ModeSelection/Actions';
import { theme } from '../utils/react';
import {
  ANNOTATIONS,
  WRITE,
  MODE,
  ANNOTATION,
} from '../constants';
import { uiStore } from '../model/instance_cache';
import { StoreActions } from '../model/StoreActions';
import { TaxonomyClass } from '../model/TaxonomyClass';
import { GeoImageNetStore } from '../model/store/GeoImageNetStore';

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

const subChildren = [
  { id: 4 },
  { id: 5 },
];
const children = [
  {
    id: 2,
    name_fr: 'children name',
  },
  {
    id: 3,
    children: subChildren,
  },
];
const classesFromApi = {
  id: 1,
  children,
};

describe('UI Elements correctly change the store', () => {
  test('Toggle annotators identifier off from default state', () => {
    const wrapper = mount(<LabelsContainer geoImageNetStore={geoImageNetStore} />);
    wrapper.simulate('click');
    expect(geoImageNetStore.show_annotators_identifiers)
      .toBe(false);
  });
  test('Toggle annotators identifier on when state is already false', () => {
    geoImageNetStore.toggle_annotator_identifiers(false);
    const wrapper = mount(<LabelsContainer geoImageNetStore={geoImageNetStore} />);
    wrapper.simulate('click');
    expect(geoImageNetStore.show_annotators_identifiers)
      .toBe(true);
  });
});

describe('Artificially granted write annotations permissions', () => {

  test('By default there are no buttons', () => {
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Actions geoImageNetStore={geoImageNetStore} />
      </MuiThemeProvider>,
    );
    expect(wrapper.find(FontAwesomeIcon).length)
      .toBe(0);
  });

  test('There are four buttons when we can write annotations', () => {
    /**
     * this is quite an arbitrary number, but it's the number of buttons that correspond to the simple annotator role
     */
    geoImageNetStore.acl.repository.permissions[ANNOTATIONS] = {
      permission_names: [WRITE],
    };
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Actions geoImageNetStore={geoImageNetStore} />
      </MuiThemeProvider>,
    );
    expect(wrapper.find(FontAwesomeIcon).length)
      .toBe(4);
  });

  test('We can activate release mode from a button', () => {
    geoImageNetStore.acl.repository.permissions[ANNOTATIONS] = {
      permission_names: [WRITE],
    };
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Actions geoImageNetStore={geoImageNetStore} />
      </MuiThemeProvider>,
    );
    wrapper.find(FontAwesomeIcon)
      .last()
      .simulate('click');
    expect(uiStore.selectedMode)
      .toBe(MODE.RELEASE);
  });
});

describe('User interface store', () => {
  test('Default mode is visualize', () => {
    const customUiStore = new UserInterfaceStore();
    expect(customUiStore.selectedMode)
      .toBe(MODE.VISUALIZATION);
  });

  test('We can change mode', () => {
    const customUiStore = new UserInterfaceStore();
    customUiStore.setMode(MODE.ASK_EXPERTISE);
    expect(customUiStore.selectedMode)
      .toBe(MODE.ASK_EXPERTISE);
  });

  test('Delete mode specific filters', () => {
    uiStore.setMode(MODE.DELETION);
    expect(geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].activated)
      .toBe(true);
    expect(geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].activated)
      .toBe(false);
    expect(geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.VALIDATED].activated)
      .toBe(false);
    expect(geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].activated)
      .toBe(false);
    expect(geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.DELETED].activated)
      .toBe(false);
  });
});

test('builds flat taxonomy_classes list', () => {
  const taxonomyStore = new TaxonomyStore(geoImageNetStore);
  const storeActions = new StoreActions(geoImageNetStore, taxonomyStore);
  storeActions.build_taxonomy_classes_structures(classesFromApi);
  expect(taxonomyStore.flat_taxonomy_classes[1].children[0].name_fr)
    .toEqual('children name');
  expect(taxonomyStore.flat_taxonomy_classes[2].name_fr)
    .toEqual('children name');
});

test('accessing flat classes changes nested ones', () => {
  const taxonomyStore = new TaxonomyStore(geoImageNetStore);
  const storeActions = new StoreActions(geoImageNetStore, taxonomyStore);
  storeActions.build_taxonomy_classes_structures(classesFromApi);
  action(() => {
    taxonomyStore.flat_taxonomy_classes[1].children[0].name = 'test_name';
    expect(taxonomyStore.flat_taxonomy_classes[2].name)
      .toEqual('test_name');
  });
});

describe('Annotation counts', () => {
  test('changing annotation counts actually changes annotation counts', () => {
    const taxonomyStore = new TaxonomyStore(geoImageNetStore);
    const storeActions = new StoreActions(geoImageNetStore, taxonomyStore);

    expect(taxonomyStore.flat_taxonomy_classes[1])
      .toBe(undefined);
    const taxonomyClass = new TaxonomyClass(1, 'name_fr', 'name_en', 1, null);

    const addTaxonomy = action(() => {
      taxonomyStore.flat_taxonomy_classes[1] = taxonomyClass;
    });
    addTaxonomy();

    expect(taxonomyStore.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW])
      .toBe(undefined);

    storeActions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, 1);
    expect(taxonomyStore.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW])
      .toBe(1);

    storeActions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, 2);
    expect(taxonomyStore.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW])
      .toBe(3);

    storeActions.change_annotation_status_count(1, ANNOTATION.STATUS.NEW, -4);
    expect(taxonomyStore.flat_taxonomy_classes[1].counts[ANNOTATION.STATUS.NEW])
      .toBe(0);

    expect(() => {
      storeActions.change_annotation_status_count(1, 'undefined', 1);
    })
      .toThrow('undefined is not a status that is supported by our platform.');

    expect(() => {
      storeActions.change_annotation_status_count(-10, ANNOTATION.STATUS.NEW, 1);
    })
      .toThrow('Trying to change the counts of a non-existent taxonomy class.');
  });
});

describe('Annotation visibility toggling.', () => {
  test('toggle_annotation_status_visibility refuses incorrect input.', () => {
    const taxonomyStore = new TaxonomyStore(geoImageNetStore);
    const storeActions = new StoreActions(geoImageNetStore, taxonomyStore);
    expect(() => {
      storeActions.toggle_annotation_status_visibility('not_a_real_status');
    })
      .toThrow('Invalid annotation status: [not_a_real_status]');
  });

  test('toggle_annotation_status_visibility toggles existent annotation status visibility', () => {
    const taxonomyStore = new TaxonomyStore(geoImageNetStore);
    const storeActions = new StoreActions(geoImageNetStore, taxonomyStore);
    const status = 'new';
    expect(geoImageNetStore.annotationStatusFilters[status].activated)
      .toBe(true);
    storeActions.toggle_annotation_status_visibility(status);
    expect(geoImageNetStore.annotationStatusFilters[status].activated)
      .toBe(false);
  });
});
