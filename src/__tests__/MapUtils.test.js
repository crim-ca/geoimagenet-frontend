// @flow strict

import {ANNOTATION} from "../domain/constants";
import {AnnotationFilter, User} from "../domain/entities";
import {make_annotation_ownership_cql_filter} from "../components/Map/utils";

describe('CQL filter generation', () => {

    test('Single filters generate correct cql', () => {
        const others_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.OTHERS, false);
        const mine_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.MINE, false);
        const followed_users_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.FOLLOWED_USERS, false);
        const filters = [others_filter, mine_filter, followed_users_filter];
        const logged_user = new User('', '', [], 1, [{id: 2, nickname: 'user 2'}, {id: 3, nickname: 'user 3'}]);
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('');

        others_filter.activated = true;
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('annotator_id NOT IN (2,3,1)');

        others_filter.activated = false;
        mine_filter.activated = true;
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('annotator_id IN (1)');

        mine_filter.activated = false;
        followed_users_filter.activated = true;
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('annotator_id IN (2,3)');

        expect(() => {
            make_annotation_ownership_cql_filter(filters.concat([new AnnotationFilter('invalid', true)]), logged_user);
        }).toThrow('This annotation ownership filter is corrupted, we have an unrecognized type: [invalid]');

        const logged_user_without_followed_users = new User('', '', [], 1, []);
        others_filter.activated = false;
        mine_filter.activated = false;
        followed_users_filter.activated = true;
        expect(make_annotation_ownership_cql_filter(filters, logged_user_without_followed_users)).toBe('');
    });

    test('multiple filters generate correct cql', () => {
        const others_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.OTHERS, false);
        const mine_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.MINE, false);
        const followed_users_filter = new AnnotationFilter(ANNOTATION.OWNERSHIP.FOLLOWED_USERS, false);
        const filters = [others_filter, mine_filter, followed_users_filter];
        const logged_user = new User('', '', [], 1, [{id: 2, nickname: 'user 2'}, {id: 3, nickname: 'user 3'}]);
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('');

        others_filter.activated = true;
        mine_filter.activated = true;
        followed_users_filter.activated = false;
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('annotator_id NOT IN (2,3,1) OR annotator_id IN (1)');

        others_filter.activated = false;
        mine_filter.activated = true;
        followed_users_filter.activated = true;
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('annotator_id IN (1) OR annotator_id IN (2,3)');

        others_filter.activated = true;
        mine_filter.activated = false;
        followed_users_filter.activated = true;
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('annotator_id NOT IN (2,3,1) OR annotator_id IN (2,3)');
        const logged_user_without_followed_users = new User('', '', [], 1, []);
        expect(make_annotation_ownership_cql_filter(filters, logged_user_without_followed_users)).toBe('annotator_id NOT IN (1)');

        others_filter.activated = true;
        mine_filter.activated = true;
        followed_users_filter.activated = true;
        expect(make_annotation_ownership_cql_filter(filters, logged_user)).toBe('');
    });

});
