// @flow strict
import { configure, observable, computed, action } from 'mobx';
import { make_annotation_ownership_cql_filter } from '../components/Map/utils';

import type { GeoImageNetStore } from './GeoImageNetStore';
import type { TaxonomyStore } from './TaxonomyStore';
import type { Annotation, WfsResponse } from '../Types';
import type { DataQueries } from '../domain/data-queries';

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

  data_queries: DataQueries;

  constructor(
    geoserver_endpoint: string,
    annotation_namespace: string,
    annotation_layer: string,
    state_proxy: GeoImageNetStore,
    taxonomy_store: TaxonomyStore,
    data_queries: DataQueries,
  ) {
    this.geoserver_endpoint = geoserver_endpoint;
    this.annotation_namespace = annotation_namespace;
    this.annotation_layer = annotation_layer;
    this.state_proxy = state_proxy;
    this.taxonomy_store = taxonomy_store;
    this.data_queries = data_queries;
  }

  refresh_content = async () => {
    const type_name = `${this.annotation_namespace}:${this.annotation_layer}`;
    const json: WfsResponse = await this.data_queries.get_annotations_browser_page(type_name, this.cql_filter, this.page_size, this.offset);
    this.set_wfs_response(json);
  };

  @action set_wfs_response = (response: WfsResponse) => {
    this.wfs_response = response;
  };

  @action next_page = () => {
    this.page_number = Math.min(this.total_pages, this.page_number + 1);
  };

  @action previous_page = () => {
    this.page_number = Math.max(1, this.page_number - 1);
  };

  @observable wfs_response: WfsResponse;

  @observable page_number: number = 1;

  @observable page_size: number = 10;

  @computed get total_features(): number {
    return this.wfs_response ? this.wfs_response.totalFeatures : 0;
  }

  @computed get total_pages(): number {
    return Math.ceil(this.total_features / this.page_size);
  }

  @computed get current_page_content(): Annotation[] {
    return this.wfs_response && this.wfs_response.features ? this.wfs_response.features : [];
  }

  @computed get offset(): number {
    return (this.page_number - 1) * this.page_size;
  }

  @computed get cql_filter(): string {
    const bits = [];
    if (this.taxonomy_store.activated_status_filters_cql.length > 0) {
      bits.push(this.taxonomy_store.activated_status_filters_cql);
    }
    if (this.taxonomy_store.taxonomy_class_id_selection_cql.length > 0) {
      bits.push(this.taxonomy_store.taxonomy_class_id_selection_cql);
    }
    const ownership_filters_array = Object.values(this.state_proxy.annotation_ownership_filters);
    if (this.state_proxy.logged_user) {
      // $FlowFixMe
      const cql_ownership = make_annotation_ownership_cql_filter(ownership_filters_array, this.state_proxy.logged_user);
      if (cql_ownership.length > 0) {
        bits.push(cql_ownership);
      }
    }
    if (bits.length === 0) {
      return '';
    }
    return `&cql_filter=(${bits.join(') AND (')})`;
  }


}
