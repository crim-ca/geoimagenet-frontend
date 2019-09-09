// @flow strict
import {configure, observable, computed, autorun, action} from 'mobx';
import {make_http_request} from "../utils/http";
import type {TaxonomyStore} from "./TaxonomyStore";

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
    taxonomy_store: TaxonomyStore;

    constructor(geoserver_endpoint: string, annotation_namespace: string, annotation_layer: string, taxonomy_store: TaxonomyStore) {
        this.geoserver_endpoint = geoserver_endpoint;
        this.annotation_namespace = annotation_namespace;
        this.annotation_layer = annotation_layer;
        this.taxonomy_store = taxonomy_store;

        autorun(this.refresh_content);
    }

    refresh_content = async () => {
        let url = `${this.geoserver_endpoint}/wfs?service=WFS&` +
            `version=1.1.0&request=GetFeature&typeName=${this.annotation_namespace}:${this.annotation_layer}&` +
            `outputFormat=application/json&srsname=EPSG:3857&` +
            '&cql_filter=status IN (\'new\', \'pre_released\')';
        const class_id_selection = this.taxonomy_store.taxonomy_class_id_selection;
        if (class_id_selection.length > 0) {
            url += ` AND (${class_id_selection}) `;
        }
            // '&maxfeatures=2&startindex=0';
        const response = await make_http_request(url);
        const json = await response.json();
        this.set_features(json.features);
    };

    @action set_features = (features: []) => {
        this.current_page_content = features;
    };

    @observable page_number: number = 1;
    @observable page_size: number = 20;

    @computed get offset(): number {
        return (this.page_number - 1) * this.page_size;
    }

    @observable current_page_content: [] = [];

}
