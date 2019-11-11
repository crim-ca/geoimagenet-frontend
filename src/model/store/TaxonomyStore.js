// @flow strict
import { action, computed, observable } from 'mobx';
import { i18n } from '../../utils/index';
import type { LeafClassGroup } from '../../Types';
import type { TaxonomyClass } from '../../domain/entities';
import type { UserInterfaceStore } from './UserInterfaceStore';

export class TaxonomyStore {
  constructor(uiStore: UserInterfaceStore) {
    this.uiStore = uiStore;
  }

  /**
   * The flat taxonomy classes structure simplifies the access to classes when we need to change one directly, without looping over the whole taxonomy structure to find the one we want.
   */
  @observable flat_taxonomy_classes = {};

  @observable selected_taxonomy_class: TaxonomyClass;

  @action select_taxonomy_class(taxonomy_class: TaxonomyClass) {
    this.selected_taxonomy_class = taxonomy_class;
  }

  @action toggle_pinned_class(taxonomy_class: TaxonomyClass, override?: boolean): void {
    if (override !== undefined) {
      taxonomy_class.pinned = override;
    } else {
      taxonomy_class.pinned = !taxonomy_class.pinned;
    }
    /**
     * when a class has children, we need to set the pin upon its children as well, as they're the ones that are gonna be displayed
     */
    if (taxonomy_class.children && taxonomy_class.children.length > 0) {
      taxonomy_class.children.forEach(c => {
        this.toggle_pinned_class(c, taxonomy_class.pinned);
      });
    }
  }

  /**
   * Inverts a taxonomy class annotations visibility on the viewport, as well as all this class's children's visibility.
   * Note that filters still apply on what annotations statuses are shown.
   */
  @action invert_taxonomy_class_visibility(taxonomy_class: TaxonomyClass, override?: boolean) {
    if (override !== undefined) {
      taxonomy_class.visible = override;
    } else {
      taxonomy_class.visible = !taxonomy_class.visible;
    }
    if (taxonomy_class.children && taxonomy_class.children.length > 0) {
      taxonomy_class.children.forEach(c => {
        this.invert_taxonomy_class_visibility(c, taxonomy_class.visible);
      });
    }
  }

  /**
   * Invert the opened property for specific taxonomy class id
   * the opened param should allow to override the toggling to force open or closed
   */
  @action toggle_taxonomy_class_tree_element(taxonomy_class: TaxonomyClass, opened: boolean | null = null) {
    if (opened === null) {
      taxonomy_class.opened = !taxonomy_class.opened;
      return;
    }
    taxonomy_class.opened = opened;
  }

  make_class_path(original_taxonomy_class: TaxonomyClass): string {
    /**
     * Clunky reassignment so that flow does not whine on reassigning to the passed taxonomy_class parameter
     */
    let taxonomy_class = original_taxonomy_class;
    let path = '';
    let { parent_id } = taxonomy_class;
    if (parent_id === null) {
      return '';
    }
    do {
      const parent: TaxonomyClass = this.flat_taxonomy_classes[parent_id];
      const label = i18n.t(`taxonomy_classes:${parent.id}`);
      path = `${label}/${path}`;
      taxonomy_class = parent;
      parent_id = taxonomy_class.parent_id;
    } while (parent_id !== null);
    return path;
  }

  /**
   * there is a complication here, being that when pinning a parent class (that is, a class that have children, being a branch in the taxonomy)
   * we want to display only the children
   * in comparison, the tree in both the map and the presentation show all steps of the tree, branches to children,
   * whereas in the workspace we will want to show only the children, with their breadcrumb
   *
   * as such, we organize the data in groups of leaf classes, all with the same parents
   */
  @computed get leaf_class_groups(): LeafClassGroup[] {
    const leaf_class_groups_dict = {};
    this.leaf_pinned_classes.forEach((leaf_class: TaxonomyClass) => {
      const path = this.make_class_path(leaf_class);
      if (leaf_class_groups_dict[path] === undefined) {
        leaf_class_groups_dict[path] = [leaf_class];
      } else {
        leaf_class_groups_dict[path].push(leaf_class);
      }
    });
    return Object.keys(leaf_class_groups_dict)
      .map(key => {
        const classes = leaf_class_groups_dict[key];
        return {
          path: key,
          children: classes,
        };
      });
  }

  @computed get leaf_pinned_classes(): TaxonomyClass[] {
    return this.flat_classes_as_array.filter((taxonomy_class: TaxonomyClass) => {
      return (taxonomy_class.pinned === true) && (taxonomy_class.children.length === 0);
    });
  }

  @computed get flat_classes_as_array(): TaxonomyClass[] {
    return Object.keys(this.flat_taxonomy_classes)
      .map((class_id) => this.flat_taxonomy_classes[class_id]);
  }

  @computed get selected_taxonomy_class_id(): number {
    if (this.selected_taxonomy_class !== undefined) {
      return this.selected_taxonomy_class.id;
    }
    return -1;
  }

  @computed get taxonomy_class_id_selection_cql(): string {
    const visible = [];
    Object.keys(this.flat_taxonomy_classes)
      .forEach((k) => {
        /** @var {TaxonomyClass} taxonomy_class */
        const taxonomy_class = this.flat_taxonomy_classes[k];
        if (taxonomy_class.visible) {
          visible.push(taxonomy_class.id);
        }
      });
    if (visible.length === 0) {
      return 'true=false';
    }
    return `taxonomy_class_id IN (${visible.join(',')})`;
  }

  @computed get activated_status_filters_cql(): string {
    const activatedFilters = Object.values(this.uiStore.annotationStatusFilters)
    // $FlowFixMe
      .filter((filter) => filter.activated)
      // $FlowFixMe
      .map((filter) => filter.text);
    if (activatedFilters.length === 0) {
      return 'true=false';
    }
    return `status IN ('${activatedFilters.join('\',\'')}')`;
  }
}
