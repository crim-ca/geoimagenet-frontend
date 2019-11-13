// @flow strict
import { observable, computed, action } from 'mobx';
import type { AnnotationFilterType } from '../Types';

/**
 * While an annotation status is only a string and represents a status (yes),
 * we need the actual state of that status across the platform.
 * This will in turn influence whether or not we see the counts, annotations,
 * and actions (?) related to these annotation statuses.
 */
export class AnnotationFilter {
  filterType: AnnotationFilterType;

  /**
   * The status text, as seen from the api.
   */
  text: string;

  /**
   * A human readable more beautiful text for the annotation status.
   */
  title: string;

  /**
   * Whether this annotation status should be active all across the platform.
   */
  @observable activated: boolean;

  /**
   * private container of the actual activated value.
   */
  activatedInternal: boolean;

  /**
   * While activated is about the filters, enabled is about whether or not the user can interact at all with the filter.
   * It should override the activated boolean, that is, a disabled filter that was activated should not
   * count in the cql filters.
   */
  @observable enabled: boolean;

  @action toggleActivated(override?: boolean) {
    if (override !== undefined) {
      this.activated = override;
    } else {
      this.activated = !this.activated;
    }
  }

  @action toggleEnabled(override?: boolean) {
    if (override !== undefined) {
      this.enabled = override;
    } else {
      this.enabled = !this.enabled;
    }
  }

  constructor(
    filterType: AnnotationFilterType,
    text: string,
    activated: boolean = true,
    enabled: boolean = true,
    title: string = '',
  ) {
    this.filterType = filterType;
    this.text = text;
    this.activatedInternal = activated;
    this.toggleActivated(activated);
    this.toggleEnabled(enabled);
    this.title = title;
  }
}
