// @flow strict
import {configure, observable, computed, autorun, action} from 'mobx';
import {make_http_request} from "../utils/http";
import type {TaxonomyStore} from "./TaxonomyStore";
import {make_annotation_ownership_cql_filter} from "../components/Map/utils";
import {GeoImageNetStore} from "./GeoImageNetStore";

/**
 * this is relatively important in the sense that it constraints us to mutate the store only in actions
 * otherwise, changing the store, affecting the state each time, can be compared to an open heart hemorrhage
 */
configure({
    enforceActions: 'always',
});

export class AnnotationBrowserStore {

    geoserver_endpoint: string;
    annotation_namespace: string;
    annotation_layer: string;
    state_proxy: GeoImageNetStore;
    taxonomy_store: TaxonomyStore;

    constructor(geoserver_endpoint: string, annotation_namespace: string, annotation_layer: string, state_proxy: GeoImageNetStore, taxonomy_store: TaxonomyStore) {
        this.geoserver_endpoint = geoserver_endpoint;
        this.annotation_namespace = annotation_namespace;
        this.annotation_layer = annotation_layer;
        this.state_proxy = state_proxy;
        this.taxonomy_store = taxonomy_store;

        autorun(this.refresh_content);
    }

    refresh_content = async () => {
        let url = `${this.geoserver_endpoint}/wfs?service=WFS&` +
            `version=1.1.0&request=GetFeature&typeName=${this.annotation_namespace}:${this.annotation_layer}&` +
            `outputFormat=application/json&srsname=EPSG:3857&`;
        if (this.cql_filter.length > 0) {
            url += this.cql_filter;
        }
        url += `&maxfeatures=${this.page_size}&startindex=${this.offset}`;
        const response = await make_http_request(url);
        const json = await response.json();
        this.set_features(json.features);
    };

    @action set_features = (features: []) => {
        this.current_page_content = features;
    };

    @observable page_number: number = 1;
    @observable page_size: number = 20;
    @observable current_page_content: [] = [];

    @computed get offset(): number {
        return (this.page_number - 1) * this.page_size;
    }

    @computed get cql_filter(): string {
        const bits = [];
        if (this.taxonomy_store.activated_status_filters_cql.length > 0) {
            bits.push(this.taxonomy_store.activated_status_filters_cql);
        }
        if (this.taxonomy_store.taxonomy_class_id_selection.length > 0) {
            bits.push(this.taxonomy_store.taxonomy_class_id_selection);
        }
        const ownership_filters_array = Object.values(this.state_proxy.annotation_ownership_filters);
        const cql_ownership = make_annotation_ownership_cql_filter(ownership_filters_array, this.state_proxy.logged_user);
        if (cql_ownership.length > 0) {
            bits.push(cql_ownership);
        }
        if (bits.length === 0) {
            return '';
        }
        return `&cql_filter=(${bits.join(') AND (')})`;
    }


}
