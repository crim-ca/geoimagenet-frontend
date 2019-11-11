// @flow strict

import { action } from 'mobx';
import { ANNOTATION } from '../constants';
import { AnnotationFilter, User } from '../domain/entities';
import { make_annotation_ownership_cql_filter } from '../components/Map/utils';
import { GeoImageNetStore } from '../model/store/GeoImageNetStore';
import { TaxonomyStore } from '../model/store/TaxonomyStore';

describe('Annotation status filter cql generation', () => {

  let geoImageNetStore;
  let taxonomyStore;

  beforeEach(action(() => {
    geoImageNetStore = new GeoImageNetStore();
    taxonomyStore = new TaxonomyStore(geoImageNetStore);
    action(() => {
      Object.values(geoImageNetStore.annotationStatusFilters)
        .forEach(status => {
          // $FlowFixMe
          status.activated = false;
        });
    })();
  }));

  test('Single filter', () => {
    action(() => {
      geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].activated = true;
    })();
    expect(taxonomyStore.activated_status_filters_cql)
      .toBe(`status IN ('${ANNOTATION.STATUS.NEW}')`);
  });
  test('Multiple filters', () => {
    action(() => {
      geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.NEW].activated = true;
      geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.PRE_RELEASED].activated = true;
      geoImageNetStore.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].activated = true;
    })();
    expect(taxonomyStore.activated_status_filters_cql)
      .toBe(`status IN ('${ANNOTATION.STATUS.NEW}','${ANNOTATION.STATUS.PRE_RELEASED}','${ANNOTATION.STATUS.REJECTED}')`);
  });
  test('No filters', () => {
    expect(taxonomyStore.activated_status_filters_cql)
      .toBe('true=false');
  });
});

describe('CQL filters generation', () => {

  let others_filter;
  let mine_filter;
  let followed_users_filter;
  let filters;
  let logged_user;

  beforeEach(() => {
    others_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.OTHERS, false);
    mine_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.MINE, false);
    followed_users_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.FOLLOWED_USERS, false);
    filters = [others_filter, mine_filter, followed_users_filter];
    logged_user = new User('', '', [], 1, [{
      id: 2,
      nickname: 'user 2'
    }, {
      id: 3,
      nickname: 'user 3'
    }]);
  });

  test('Invalid filter type throws', () => {
    expect(() => {
      make_annotation_ownership_cql_filter(filters.concat([new AnnotationFilter('invalid', true)]), logged_user);
    })
      .toThrow('This annotation ownership filter is corrupted, we have an unrecognized type: [invalid]');
  });

  test('Empty selection', () => {
    expect(make_annotation_ownership_cql_filter(filters, logged_user))
      .toBe('annotator_id IN (-1)');
  });

  test('Followed users when activated by a user without followed users', () => {
    const logged_user_without_followed_users = new User('', '', [], 1, []);
    followed_users_filter.activated = true;
    expect(make_annotation_ownership_cql_filter(filters, logged_user_without_followed_users))
      .toBe('');
  });

  test('Others', () => {
    others_filter.activated = true;
    expect(make_annotation_ownership_cql_filter(filters, logged_user))
      .toBe('annotator_id NOT IN (2,3,1)');
  });

  test('Mine', () => {
    mine_filter.activated = true;
    expect(make_annotation_ownership_cql_filter(filters, logged_user))
      .toBe('annotator_id IN (1)');
  });

  test('Followed users', () => {
    followed_users_filter.activated = true;
    expect(make_annotation_ownership_cql_filter(filters, logged_user))
      .toBe('annotator_id IN (2,3)');
  });

  test('Mine and others', () => {
    others_filter.activated = true;
    mine_filter.activated = true;
    expect(make_annotation_ownership_cql_filter(filters, logged_user))
      .toBe('annotator_id NOT IN (2,3,1) OR annotator_id IN (1)');
  });

  test('Mine and followed users', () => {
    mine_filter.activated = true;
    followed_users_filter.activated = true;
    expect(make_annotation_ownership_cql_filter(filters, logged_user))
      .toBe('annotator_id IN (1) OR annotator_id IN (2,3)');
  });

  test('Others and followed users', () => {
    others_filter.activated = true;
    followed_users_filter.activated = true;
    expect(make_annotation_ownership_cql_filter(filters, logged_user))
      .toBe('annotator_id NOT IN (2,3,1) OR annotator_id IN (2,3)');
  });

  test('Others and followed users when user does not have followed user', () => {
    /**
     * maybe this should not be allowed to happen, as in don't show the followed users filter is user does not have followed users
     */
    others_filter.activated = true;
    followed_users_filter.activated = true;
    const logged_user_without_followed_users = new User('', '', [], 1, []);
    expect(make_annotation_ownership_cql_filter(filters, logged_user_without_followed_users))
      .toBe('annotator_id NOT IN (1)');
  });

  test('All filters active', () => {
    others_filter.activated = true;
    mine_filter.activated = true;
    followed_users_filter.activated = true;
    expect(make_annotation_ownership_cql_filter(filters, logged_user))
      .toBe('');
  });
});
