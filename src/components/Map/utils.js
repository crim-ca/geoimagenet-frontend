// @flow strict

import { User } from '../../model/entities';
import type { AnnotationFilter } from '../../model/AnnotationFilter';
import { ANNOTATION } from '../../Types';

export function make_annotation_ownership_cql_filter(ownership_filters: AnnotationFilter[], user: User): string {
  /**
   * if none or all of the ownership filters are activated, we want the same behaviour, that is show all annotations
   * but if there's one or two, then we need to filter based on user ids
   *
   * for the different filters we need different behaviour:
   *  - others: exclude annotations by logged user id and followed users id - NOT IN (id, id1, id2, id3)
   *  - mine: include annotations by logged user id - IN (id)
   *  - followed users: include annotations by followed users - IN (id1, id2, id3)
   *  those need to be added with OR glue, for instance - ( id NOT IN (1) OR id IN (3,4,5) )
   */

  if (ownership_filters.every((filter) => filter.activated)) {
    return '';
  }
  if (ownership_filters.every((filter) => filter.activated === false)) {
    return 'annotator_id IN (-1)';
  }

  const cql_bits = [];
  ownership_filters.forEach((filter) => {
    if (!filter.activated) {
      return;
    }
    switch (filter.text) {
      case ANNOTATION.OWNERSHIP.OTHERS: {
        const user_ids = user.followed_users.map((user) => user.id);
        user_ids.push(user.id);
        cql_bits.push(`annotator_id NOT IN (${user_ids.join(',')})`);
        break;
      }
      case ANNOTATION.OWNERSHIP.MINE:
        cql_bits.push(`annotator_id IN (${user.id})`);
        break;
      case ANNOTATION.OWNERSHIP.FOLLOWED_USERS: {
        if (user.followed_users.length === 0) {
          return;
        }
        const followed_users_ids = user.followed_users.map((user) => user.id);
        cql_bits.push(`annotator_id IN (${followed_users_ids.join(',')})`);
        break;
      }
      default:
        throw new TypeError(`This annotation ownership filter is corrupted, we have an unrecognized type: [${filter.text}]`);
    }
  });
  return cql_bits.join(' OR ');
}
