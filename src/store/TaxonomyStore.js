// @flow strict

import type {GeoImageNetStore} from "./GeoImageNetStore";
import {computed} from "mobx";

export class TaxonomyStore {

    state_proxy: GeoImageNetStore;

    constructor(state_proxy: GeoImageNetStore) {
        this.state_proxy = state_proxy;
    }

    @computed get taxonomy_class_id_selection(): string {
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
            .filter(filter => filter.activated)
            .map(filter => filter.text);
        if (activated_filters.length === 0) {
            return 'true=false';
        }
        return `status IN ('${activated_filters.join("','")}')`;
    }
}
