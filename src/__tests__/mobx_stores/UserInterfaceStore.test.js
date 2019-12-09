// @flow strict

import React from 'react';
import { configure, mount } from 'enzyme';
import { action } from 'mobx';
import { JSDOM } from 'jsdom';
import Adapter from 'enzyme-adapter-react-16';
import { User } from '../../model/User';
import { make_annotation_ownership_cql_filter } from '../../components/Map/utils';
import { AnnotationFilter as AnnotationFilterEntity, AnnotationFilter } from '../../model/AnnotationFilter';
import { TaxonomyStore } from '../../model/store/TaxonomyStore';
import { UserInterfaceStore } from '../../model/store/UserInterfaceStore';
import { AnnotationFilter as AnnotationFilterComponent } from '../../components/Map/Filters/AnnotationFilter';
import { wait } from '../utils';
import { ANNOTATION } from '../../Types';
import { MODE } from '../../constants';
import { uiStore } from '../../model/instance_cache';

const { window } = new JSDOM('<!doctype html>');

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
global.requestAnimationFrame = function requestAnimationFrame(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function cancelAnimationFrame(id) {
  clearTimeout(id);
};
copyProps(window, global);
configure({ adapter: new Adapter() });

describe('Annotation filter entity', () => {
  test('Activated by default', () => {
    const filter = new AnnotationFilter(ANNOTATION.FILTER.STATUS, 'text');
    expect(filter.activated)
      .toBe(true);
  });
  test('Enabled by default', () => {
    const filter = new AnnotationFilter(ANNOTATION.FILTER.STATUS, 'text');
    expect(filter.enabled)
      .toBe(true);
  });
  test('Can be deactivated', () => {
    const filter = new AnnotationFilter(ANNOTATION.FILTER.STATUS, 'text');
    filter.toggleActivated(false);
    expect(filter.activated)
      .toBe(false);
  });
  test('Can be disabled', () => {
    const filter = new AnnotationFilter(ANNOTATION.FILTER.STATUS, 'text');
    filter.toggleEnabled(false);
    expect(filter.enabled)
      .toBe(false);
  });
  test('Deactivated when activated but disabled', () => {
    const filter = new AnnotationFilter(ANNOTATION.FILTER.STATUS, 'text', true, false);
    expect(filter.activated)
      .toBe(false);
  });
});

describe('Mode selection', () => {
  let customUiStore: UserInterfaceStore;

  beforeEach(() => {
    customUiStore = new UserInterfaceStore();
  });

  test('Default mode is visualize', () => {
    expect(customUiStore.selectedMode)
      .toBe(MODE.VISUALIZATION);
  });

  test('We can change mode', () => {
    customUiStore.setMode(MODE.ASK_EXPERTISE);
    expect(customUiStore.selectedMode)
      .toBe(MODE.ASK_EXPERTISE);
  });

  test('Constraining modes correctly activate manually deactivated filters', () => {
    customUiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleActivated(false);
    customUiStore.setMode(MODE.DELETION);
    expect(customUiStore.filterActivationMap).toStrictEqual([
      [ANNOTATION.STATUS.NEW, true],
      [ANNOTATION.STATUS.RELEASED, false],
      [ANNOTATION.STATUS.DELETED, false],
      [ANNOTATION.STATUS.VALIDATED, false],
      [ANNOTATION.STATUS.REJECTED, false],
      [ANNOTATION.OWNERSHIP.MINE, true],
      [ANNOTATION.OWNERSHIP.OTHERS, false],
      [ANNOTATION.OWNERSHIP.FOLLOWED_USERS, false],
    ]);
  });

  test('Constraint to non-constraint mode restores selection', () => {
    const initialFilterMap = customUiStore.filterActivationMap;
    customUiStore.setMode(MODE.VALIDATION);
    expect(customUiStore.filterActivationMap).not.toBe(initialFilterMap);
    customUiStore.setMode(MODE.VISUALIZATION);
    expect(customUiStore.filterActivationMap).toStrictEqual(initialFilterMap);
  });

  test('Builds filter map as expected', () => {
    expect(customUiStore.filterActivationMap).toStrictEqual([
      [ANNOTATION.STATUS.NEW, true],
      [ANNOTATION.STATUS.RELEASED, true],
      [ANNOTATION.STATUS.DELETED, true],
      [ANNOTATION.STATUS.VALIDATED, true],
      [ANNOTATION.STATUS.REJECTED, true],
      [ANNOTATION.OWNERSHIP.MINE, true],
      [ANNOTATION.OWNERSHIP.OTHERS, true],
      [ANNOTATION.OWNERSHIP.FOLLOWED_USERS, true],
    ]);
  });

  test('Correct filter map for deletion mode', () => {
    customUiStore.setMode(MODE.DELETION);
    expect(customUiStore.filterActivationMap).toStrictEqual([
      [ANNOTATION.STATUS.NEW, true],
      [ANNOTATION.STATUS.RELEASED, false],
      [ANNOTATION.STATUS.DELETED, false],
      [ANNOTATION.STATUS.VALIDATED, false],
      [ANNOTATION.STATUS.REJECTED, false],
      [ANNOTATION.OWNERSHIP.MINE, true],
      [ANNOTATION.OWNERSHIP.OTHERS, false],
      [ANNOTATION.OWNERSHIP.FOLLOWED_USERS, false],
    ]);
  });
});

describe('User interface store', () => {
  test('Collections allow access to instances', () => {
    const store = new UserInterfaceStore();
    store.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleActivated(false);
    expect(store.annotationStatusFilters[ANNOTATION.STATUS.NEW].activated)
      .toBe(false);
  });

  test('Delete specific annotation filters', () => {
    /*
    when interacting with the annotation browser in deletion mode, we only want to see the new annotations,
    because new annotations are the only ones that can be deleted.
     */
    uiStore.setMode(MODE.DELETION);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].enabled)
      .toBe(true);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.VALIDATED].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.DELETED].enabled)
      .toBe(false);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].enabled)
      .toBe(true);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.FOLLOWED_USERS].enabled)
      .toBe(false);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.OTHERS].enabled)
      .toBe(false);
  });

  test('Release specific annotation filters', () => {
    /*
    when interacting with the annotation browser in release mode, we only want to see the new and owned annotations,
    because these are the only ones that can be released.
     */
    uiStore.setMode(MODE.RELEASE);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].enabled)
      .toBe(true);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.VALIDATED].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.DELETED].enabled)
      .toBe(false);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].enabled)
      .toBe(true);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.FOLLOWED_USERS].enabled)
      .toBe(false);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.OTHERS].enabled)
      .toBe(false);
  });

  test('Validation specific annotation filters', () => {
    /**
     * When validating, we only want to see owned and followed users released annotations
     * Only these can be validated or rejected
     */
    uiStore.setMode(MODE.VALIDATION);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].enabled)
      .toBe(true);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.VALIDATED].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].enabled)
      .toBe(false);
    expect(uiStore.annotationStatusFilters[ANNOTATION.STATUS.DELETED].enabled)
      .toBe(false);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].enabled)
      .toBe(true);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.FOLLOWED_USERS].enabled)
      .toBe(true);
    expect(uiStore.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.OTHERS].enabled)
      .toBe(false);
  });
});

describe('Annotation filter component', () => {
  test('Filter components has a checked input by default', () => {
    const filter = new AnnotationFilterEntity(ANNOTATION.FILTER.STATUS, 'new');
    const wrapper = mount(<AnnotationFilterComponent filter={filter} />);
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.props().checked)
      .toBe(true);
  });
  test('Filter components unchecks the box', async () => {
    const filter = new AnnotationFilterEntity(ANNOTATION.FILTER.STATUS, 'new');
    expect(filter.activated)
      .toBe(true);
    const wrapper = mount(<AnnotationFilterComponent filter={filter} />);
    filter.toggleActivated(false);
    await wait(0);
    wrapper.update();
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.props().checked)
      .toBe(false);
  });
});

describe('Annotation filter cql generation', () => {
  let taxonomyStore;

  beforeEach(action(() => {
    taxonomyStore = new TaxonomyStore(uiStore);
    action(() => {
      Object.values(uiStore.annotationStatusFilters)
        .forEach((status: AnnotationFilter) => {
          // $FlowFixMe
          status.toggleActivated(false);
        });
    })();
  }));

  test('Single filter', () => {
    action(() => {
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleActivated(true);
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleEnabled(true);
    })();
    expect(taxonomyStore.activated_status_filters_cql)
      .toBe(`status IN ('${ANNOTATION.STATUS.NEW}')`);
  });
  test('Multiple filters', () => {
    action(() => {
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleActivated(true);
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleEnabled(true);
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].toggleActivated(true);
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].toggleEnabled(true);
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.DELETED].toggleActivated(true);
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.DELETED].toggleEnabled(true);
    })();
    expect(taxonomyStore.activated_status_filters_cql)
      .toBe(
        `status IN ('${ANNOTATION.STATUS.NEW}','${ANNOTATION.STATUS.REJECTED}','${ANNOTATION.STATUS.DELETED}')`,
      );
  });
  test('No filters', () => {
    expect(taxonomyStore.activated_status_filters_cql)
      .toBe('true=false');
  });
});

describe('CQL filters generation', () => {
  let othersFilter;
  let mineFilter;
  let followedUsersFilter;
  let filters;
  let user;

  beforeEach(() => {
    othersFilter = new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, ANNOTATION.OWNERSHIP.OTHERS, false);
    mineFilter = new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, ANNOTATION.OWNERSHIP.MINE, false);
    followedUsersFilter = new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, ANNOTATION.OWNERSHIP.FOLLOWED_USERS, false);
    filters = [othersFilter, mineFilter, followedUsersFilter];
    user = new User('', '', [], 1, [{
      id: 2,
      nickname: 'user 2',
    }, {
      id: 3,
      nickname: 'user 3',
    }]);
  });

  test('Invalid filter type throws', () => {
    expect(() => {
      make_annotation_ownership_cql_filter(
        filters.concat([new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, 'invalid', true)]),
        user,
      );
    })
      .toThrow('This annotation ownership filter is corrupted, we have an unrecognized type: [invalid]');
  });

  test('Empty selection', () => {
    expect(make_annotation_ownership_cql_filter(filters, user))
      .toBe('annotator_id IN (-1)');
  });

  test('Followed users when activated by a user without followed users', () => {
    const loggedUserWithoutFollowedUsers = new User('', '', [], 1, []);
    followedUsersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, loggedUserWithoutFollowedUsers))
      .toBe('');
  });

  test('Others', () => {
    othersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, user))
      .toBe('annotator_id NOT IN (2,3,1)');
  });

  test('Mine', () => {
    mineFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, user))
      .toBe('annotator_id IN (1)');
  });

  test('Followed users', () => {
    followedUsersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, user))
      .toBe('annotator_id IN (2,3)');
  });

  test('Mine and others', () => {
    othersFilter.toggleActivated(true);
    mineFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, user))
      .toBe('annotator_id NOT IN (2,3,1) OR annotator_id IN (1)');
  });

  test('Mine and followed users', () => {
    mineFilter.toggleActivated(true);
    followedUsersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, user))
      .toBe('annotator_id IN (1) OR annotator_id IN (2,3)');
  });

  test('Others and followed users', () => {
    othersFilter.toggleActivated(true);
    followedUsersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, user))
      .toBe('annotator_id NOT IN (2,3,1) OR annotator_id IN (2,3)');
  });

  test('Others and followed users when user does not have followed user', () => {
    /**
     * maybe this should not be allowed to happen,
     * as in don't show the followed users filter is user does not have followed users
     */
    othersFilter.toggleActivated(true);
    followedUsersFilter.toggleActivated(true);
    const loggedUserWithoutFollowedUsers = new User('', '', [], 1, []);
    expect(make_annotation_ownership_cql_filter(filters, loggedUserWithoutFollowedUsers))
      .toBe('annotator_id NOT IN (1)');
  });

  test('All filters active', () => {
    othersFilter.toggleActivated(true);
    mineFilter.toggleActivated(true);
    followedUsersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, user))
      .toBe('');
  });
});
