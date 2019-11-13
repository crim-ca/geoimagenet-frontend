// @flow strict
import { action, observable } from 'mobx';
import { MODE } from '../../constants';
import type { AnnotationOwnershipFilters, AnnotationStatusFilters } from '../../Types';
import { AnnotationFilter } from '../AnnotationFilter';
import { ANNOTATION } from '../../Types';

const { VISUALIZATION } = MODE;

class UserInterfaceStore {
  @observable selectedMode: string = VISUALIZATION;

  @action.bound setMode(mode: string) {
    this.selectedMode = mode;
  }

  /**
   * The visible annotations types should federate every part of the platform that manages annotations, from the counts
   * in the classes hierarchies to the visible annotations on the map, and every future annotations interactions.
   */
  @observable annotationStatusFilters: AnnotationStatusFilters = {
    [ANNOTATION.STATUS.NEW]: new AnnotationFilter(ANNOTATION.FILTER.STATUS, ANNOTATION.STATUS.NEW),
    [ANNOTATION.STATUS.PRE_RELEASED]: new AnnotationFilter(
      ANNOTATION.FILTER.STATUS,
      ANNOTATION.STATUS.PRE_RELEASED,
    ),
    [ANNOTATION.STATUS.RELEASED]: new AnnotationFilter(ANNOTATION.FILTER.STATUS, ANNOTATION.STATUS.RELEASED),
    [ANNOTATION.STATUS.VALIDATED]: new AnnotationFilter(ANNOTATION.FILTER.STATUS, ANNOTATION.STATUS.VALIDATED),
    [ANNOTATION.STATUS.REJECTED]: new AnnotationFilter(ANNOTATION.FILTER.STATUS, ANNOTATION.STATUS.REJECTED),
    [ANNOTATION.STATUS.DELETED]: new AnnotationFilter(ANNOTATION.FILTER.STATUS, ANNOTATION.STATUS.DELETED),
  };

  @observable annotationOwnershipFilters: AnnotationOwnershipFilters = {
    [ANNOTATION.OWNERSHIP.OTHERS]: new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, ANNOTATION.OWNERSHIP.OTHERS),
    [ANNOTATION.OWNERSHIP.MINE]: new AnnotationFilter(ANNOTATION.FILTER.OWNERSHIP, ANNOTATION.OWNERSHIP.MINE),
    [ANNOTATION.OWNERSHIP.FOLLOWED_USERS]: new AnnotationFilter(
      ANNOTATION.FILTER.OWNERSHIP,
      ANNOTATION.OWNERSHIP.FOLLOWED_USERS,
    ),
  };
}

export { UserInterfaceStore };
