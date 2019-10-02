// @flow strict

import {action, computed, observable} from "mobx";

import type {GeoImageNetStore} from "./GeoImageNetStore";
import type {TaxonomyClass} from "../domain/entities";

export class TaxonomyStore {

    state_proxy: GeoImageNetStore;

    constructor(state_proxy: GeoImageNetStore) {
        this.state_proxy = state_proxy;
    }

    /**
     * The flat taxonomy classes structure simplifies the access to classes when we need to change one directly, without looping over the whole taxonomy structure to find the one we want.
     */
    @observable flat_taxonomy_classes = {};
    @observable selected_taxonomy_class: TaxonomyClass;

    @action select_taxonomy_class(taxonomy_class: TaxonomyClass) {
        this.selected_taxonomy_class = taxonomy_class;
    }
    @action toggle_pinned_class(taxonomy_class: TaxonomyClass, override: boolean): void {
        if (override !== undefined) {
            taxonomy_class.pinned = override;
        } else {
            taxonomy_class.pinned = !taxonomy_class.pinned;
        }

    }

    /**
     * there is a complication here, being that when pinning a parent class (that is, a class that have children, being a branch in the taxonomy)
     * we want to display only the children
     * in comparison, the tree in both the map and the presentation show all steps of the tree, branches to children,
     * whereas in the workspace we will want to show only the children, with their breadcrumb
     *
     * as such, we organize the data in groups of leaf classes, all with the same parents
     */
    @computed get leaf_pinned_classes(): TaxonomyClass[] {

        return Object.keys(this.flat_taxonomy_classes)
            .map(class_id => this.flat_taxonomy_classes[class_id])
            .filter(taxonomy_class => taxonomy_class.pinned === true);
    }

    @computed get selected_taxonomy_class_id(): number {
        if (this.selected_taxonomy_class !== undefined) {
            return this.selected_taxonomy_class.id;
        }
        return -1;
    }

    @computed get taxonomy_class_id_selection_cql(): string {
        const visible = [];
        Object.keys(this.flat_taxonomy_classes).forEach(k => {
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
        const activated_filters = Object.values(this.state_proxy.annotation_status_filters)
        // $FlowFixMe
            .filter(filter => filter.activated)
            // $FlowFixMe
            .map(filter => filter.text);
        if (activated_filters.length === 0) {
            return 'true=false';
        }
        return `status IN ('${activated_filters.join("','")}')`;
    }
}
