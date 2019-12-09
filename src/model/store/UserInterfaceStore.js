// @flow strict
import {
  action,
  observable,
  computed,
} from 'mobx';
import { MODE } from '../../constants';
import type { AnnotationOwnershipFilters, AnnotationStatusFilters } from '../../Types';
import { AnnotationFilter } from '../AnnotationFilter';
import { ANNOTATION } from '../../Types';

const {
  VISUALIZATION,
  CREATION,
  MODIFICATION,
  DELETION,
  RELEASE,
  VALIDATION,
} = MODE;

type FilterSelectionTuple = [string, boolean];
type FilterSelectionMap = FilterSelectionTuple[];

class UserInterfaceStore {
  @observable selectedMode: string;

  previousFilterSelection: FilterSelectionMap;

  previousSelectedMode: string;

  /**
   * When we move to a mode with filter constraints (such as deletion)
   * from a mode without filter constraints (such as visualize) we need to save the current filter state
   *
   * when we move away from a mode with filter constraints
   * to a mode without filter constraints (visualize) we need to restore previous config
   */
  @action.bound setMode(mode: string) {
    this.previousSelectedMode = this.selectedMode || mode;
    this.selectedMode = mode;

    const noConstraintsFilters = [VISUALIZATION, CREATION, MODIFICATION];
    const constraintsFilters = [DELETION, RELEASE, VALIDATION];

    const fromNonConstrainingMode = noConstraintsFilters.indexOf(this.previousSelectedMode) > -1;
    const toConstrainingMode = constraintsFilters.indexOf(this.selectedMode) > -1;

    if (fromNonConstrainingMode) {
      // save current filter config
      this.previousFilterSelection = this.filterActivationMap;
    }

    if (toConstrainingMode) {
      this.disableAllFilters();
      this.setConstrainingFiltersForSelectedMode();
    }

    const fromConstrainingMode = constraintsFilters.indexOf(this.previousSelectedMode) > -1;
    const toNonConstrainingMode = noConstraintsFilters.indexOf(this.selectedMode) > -1;
    if (fromConstrainingMode && toNonConstrainingMode) {
      // restore previous filter selection
      this.enableAllFilters();
      this.restoreFilters(this.previousFilterSelection);
    }
  }

  constructor() {
    this.setMode(VISUALIZATION);
  }

  setConstrainingFiltersForSelectedMode() {
    switch (this.selectedMode) {
      case MODE.DELETION:
      case MODE.RELEASE:
        this.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleActivated(true);
        this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].toggleActivated(true);
        this.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleEnabled(true);
        this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].toggleEnabled(true);
        break;
      case MODE.VALIDATION:
        this.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].toggleActivated(true);
        this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].toggleActivated(true);
        this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.FOLLOWED_USERS].toggleActivated(true);
        this.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].toggleEnabled(true);
        this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].toggleEnabled(true);
        this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.FOLLOWED_USERS].toggleEnabled(true);
    }
  }

  @action restoreFilters(filterSelectionMap: FilterSelectionMap) {
    filterSelectionMap.forEach((filterSelection: FilterSelectionTuple) => {
      const [filterName, filterActivation] = filterSelection;
      if (this.annotationStatusFilters[filterName]) {
        this.annotationStatusFilters[filterName].toggleActivated(filterActivation);
      } else if (this.annotationOwnershipFilters[filterName]) {
        this.annotationOwnershipFilters[filterName].toggleActivated(filterActivation);
      }
    });
  }

  @computed get filterActivationMap(): FilterSelectionMap {
    return [
      [ANNOTATION.STATUS.NEW, this.annotationStatusFilters[ANNOTATION.STATUS.NEW].activated],
      [ANNOTATION.STATUS.RELEASED, this.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].activated],
      [ANNOTATION.STATUS.DELETED, this.annotationStatusFilters[ANNOTATION.STATUS.DELETED].activated],
      [ANNOTATION.STATUS.VALIDATED, this.annotationStatusFilters[ANNOTATION.STATUS.VALIDATED].activated],
      [ANNOTATION.STATUS.REJECTED, this.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].activated],
      [ANNOTATION.OWNERSHIP.MINE, this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].activated],
      [ANNOTATION.OWNERSHIP.OTHERS, this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.OTHERS].activated],
      [
        ANNOTATION.OWNERSHIP.FOLLOWED_USERS,
        this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.FOLLOWED_USERS].activated,
      ],
    ];
  }

  @action disableAllFilters() {
    this.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleEnabled(false);
    this.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].toggleEnabled(false);
    this.annotationStatusFilters[ANNOTATION.STATUS.DELETED].toggleEnabled(false);
    this.annotationStatusFilters[ANNOTATION.STATUS.VALIDATED].toggleEnabled(false);
    this.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].toggleEnabled(false);
    this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].toggleEnabled(false);
    this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.OTHERS].toggleEnabled(false);
    this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.FOLLOWED_USERS].toggleEnabled(false);
  }

  @action enableAllFilters() {
    this.annotationStatusFilters[ANNOTATION.STATUS.NEW].toggleEnabled(true);
    this.annotationStatusFilters[ANNOTATION.STATUS.RELEASED].toggleEnabled(true);
    this.annotationStatusFilters[ANNOTATION.STATUS.DELETED].toggleEnabled(true);
    this.annotationStatusFilters[ANNOTATION.STATUS.VALIDATED].toggleEnabled(true);
    this.annotationStatusFilters[ANNOTATION.STATUS.REJECTED].toggleEnabled(true);
    this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.MINE].toggleEnabled(true);
    this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.OTHERS].toggleEnabled(true);
    this.annotationOwnershipFilters[ANNOTATION.OWNERSHIP.FOLLOWED_USERS].toggleEnabled(true);
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
