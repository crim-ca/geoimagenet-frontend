// @flow strict

import {action, computed, observable} from "mobx";

import type {GeoImageNetStore} from "./GeoImageNetStore";
import type {TaxonomyClass} from "../domain/entities";

export class TaxonomyStore {

    state_proxy: GeoImageNetStore;

    constructor(state_proxy: GeoImageNetStore) {
        this.state_proxy = state_proxy;
    }

    @observable selected_taxonomy_class: TaxonomyClass;

    @action select_taxonomy_class(taxonomy_class: TaxonomyClass) {
        this.selected_taxonomy_class = taxonomy_class;
    }

    @computed get selected_taxonomy_class_id(): number {
        if (this.selected_taxonomy_class !== undefined) {
            return this.selected_taxonomy_class.id;
        }
        return -1;
    }

    @computed get taxonomy_class_id_selection_cql(): string {
        const visible = [];
        Object.keys(this.state_proxy.flat_taxonomy_classes).forEach(k => {
            /** @var {TaxonomyClass} taxonomy_class */
            const taxonomy_class = this.state_proxy.flat_taxonomy_classes[k];
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
