// @flow strict

import React from 'react';
import { configure, mount } from 'enzyme';
import { action } from 'mobx';
import { JSDOM } from 'jsdom';
import Adapter from 'enzyme-adapter-react-16';
import { User } from '../model/entities';
import { make_annotation_ownership_cql_filter } from '../components/Map/utils';
import { AnnotationFilter as AnnotationFilterEntity, AnnotationFilter } from '../model/AnnotationFilter';
import { TaxonomyStore } from '../model/store/TaxonomyStore';
import { UserInterfaceStore } from '../model/store/UserInterfaceStore';
import { AnnotationFilter as AnnotationFilterComponent } from '../components/Map/Filters/AnnotationFilter';
import { wait } from './utils';
import { ANNOTATION } from '../Types';

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
});

describe('User interface store', () => {
  test('Collections allow access to instances', () => {
    const store = new UserInterfaceStore();
    store.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleActivated(false);
    expect(store.annotationStatusFilters[ANNOTATION.STATUS.NEW].activated)
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
  let uiStore;

  beforeEach(action(() => {
    uiStore = new UserInterfaceStore();
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
    })();
    expect(taxonomyStore.activated_status_filters_cql)
      .toBe(`status IN ('${ANNOTATION.STATUS.NEW}')`);
  });
  test('Multiple filters', () => {
    action(() => {
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleActivated(true);
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.PRE_RELEASED].toggleActivated(true);
      uiStore.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].toggleActivated(true);
    })();
    expect(taxonomyStore.activated_status_filters_cql)
      .toBe(
        `status IN ('${ANNOTATION.STATUS.NEW}','${ANNOTATION.STATUS.PRE_RELEASED}','${ANNOTATION.STATUS.REJECTED}')`,
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
  let loggedUser;

  beforeEach(() => {
    othersFilter = new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, ANNOTATION.OWNERSHIP.OTHERS, false);
    mineFilter = new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, ANNOTATION.OWNERSHIP.MINE, false);
    followedUsersFilter = new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, ANNOTATION.OWNERSHIP.FOLLOWED_USERS, false);
    filters = [othersFilter, mineFilter, followedUsersFilter];
    loggedUser = new User('', '', [], 1, [{
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
        loggedUser,
      );
    })
      .toThrow('This annotation ownership filter is corrupted, we have an unrecognized type: [invalid]');
  });

  test('Empty selection', () => {
    expect(make_annotation_ownership_cql_filter(filters, loggedUser))
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
    expect(make_annotation_ownership_cql_filter(filters, loggedUser))
      .toBe('annotator_id NOT IN (2,3,1)');
  });

  test('Mine', () => {
    mineFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, loggedUser))
      .toBe('annotator_id IN (1)');
  });

  test('Followed users', () => {
    followedUsersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, loggedUser))
      .toBe('annotator_id IN (2,3)');
  });

  test('Mine and others', () => {
    othersFilter.toggleActivated(true);
    mineFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, loggedUser))
      .toBe('annotator_id NOT IN (2,3,1) OR annotator_id IN (1)');
  });

  test('Mine and followed users', () => {
    mineFilter.toggleActivated(true);
    followedUsersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, loggedUser))
      .toBe('annotator_id IN (1) OR annotator_id IN (2,3)');
  });

  test('Others and followed users', () => {
    othersFilter.toggleActivated(true);
    followedUsersFilter.toggleActivated(true);
    expect(make_annotation_ownership_cql_filter(filters, loggedUser))
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
    expect(make_annotation_ownership_cql_filter(filters, loggedUser))
      .toBe('');
  });
});
