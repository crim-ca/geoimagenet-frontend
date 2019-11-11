// @flow strict
import { action, observable } from 'mobx';
import { ANNOTATION, MODE } from '../../constants';
import type { AnnotationOwnershipFilters, AnnotationStatusFilters } from '../../Types';
import { AnnotationFilter } from '../../domain/entities';

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
    [ANNOTATION.STATUS.NEW]: observable.object(new AnnotationFilter(ANNOTATION.STATUS.NEW, true)),
    [ANNOTATION.STATUS.PRE_RELEASED]: observable.object(new AnnotationFilter(ANNOTATION.STATUS.PRE_RELEASED, true)),
    [ANNOTATION.STATUS.RELEASED]: observable.object(new AnnotationFilter(ANNOTATION.STATUS.RELEASED, true)),
    [ANNOTATION.STATUS.VALIDATED]: observable.object(new AnnotationFilter(ANNOTATION.STATUS.VALIDATED, true)),
    [ANNOTATION.STATUS.REJECTED]: observable.object(new AnnotationFilter(ANNOTATION.STATUS.REJECTED, true)),
    [ANNOTATION.STATUS.DELETED]: observable.object(new AnnotationFilter(ANNOTATION.STATUS.DELETED, true)),
  };

  @observable annotationOwnershipFilters: AnnotationOwnershipFilters = {
    [ANNOTATION.OWNERSHIP.OTHERS]: observable.object(new AnnotationFilter(ANNOTATION.OWNERSHIP.OTHERS, true)),
    [ANNOTATION.OWNERSHIP.MINE]: observable.object(new AnnotationFilter(ANNOTATION.OWNERSHIP.MINE, true)),
    [ANNOTATION.OWNERSHIP.FOLLOWED_USERS]: observable.object(new AnnotationFilter(ANNOTATION.OWNERSHIP.FOLLOWED_USERS, true)),
  };
}

export { UserInterfaceStore };
