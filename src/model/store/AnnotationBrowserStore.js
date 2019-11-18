// @flow strict
import {
  configure,
  observable,
  computed,
  action,
  autorun,
} from 'mobx';
import { make_annotation_ownership_cql_filter } from '../../components/Map/utils';
import type { GeoImageNetStore } from './GeoImageNetStore';
import type { TaxonomyStore } from './TaxonomyStore';
import type { Annotation, WfsResponse } from '../../Types';
import type { DataQueries } from '../../domain/data-queries';
import type { UserInterfaceStore } from './UserInterfaceStore';

/**
 * this is relatively important in the sense that it constraints us to mutate the store only in actions
 * otherwise, changing the store, affecting the state each time, can be compared to an open heart hemorrhage
 */
configure({
  enforceActions: 'always',
});

export class AnnotationBrowserStore {
  geoserverEndpoint: string;

  annotationNamespace: string;

  annotationLayer: string;

  geoImageNetStore: GeoImageNetStore;

  uiStore: UserInterfaceStore;

  taxonomyStore: TaxonomyStore;

  dataQueries: DataQueries;

  constructor(
    geoserverEndpoint: string,
    annotationNamespace: string,
    annotationLayer: string,
    geoImageNetStore: GeoImageNetStore,
    uiStore: UserInterfaceStore,
    taxonomyStore: TaxonomyStore,
    dataQueries: DataQueries,
  ) {
    this.geoserverEndpoint = geoserverEndpoint;
    this.annotationNamespace = annotationNamespace;
    this.annotationLayer = annotationLayer;
    this.geoImageNetStore = geoImageNetStore;
    this.uiStore = uiStore;
    this.taxonomyStore = taxonomyStore;
    this.dataQueries = dataQueries;
    autorun(this.refreshContent);
  }

  refreshContent = async () => {
    const typeName = `${this.annotationNamespace}:${this.annotationLayer}`;
    const json = await this.dataQueries.get_annotations_browser_page(
      typeName,
      this.cql_filter,
      this.page_size.toString(10),
      this.offset.toString(10),
    );
    this.setWfsResponse(json);
  };

  @action setWfsResponse(wfsResponse: WfsResponse) {
    this.wfsResponse = wfsResponse;
  }

  @action next_page = () => {
    this.page_number = Math.min(this.total_pages, this.page_number + 1);
  };

  @action previous_page = () => {
    this.page_number = Math.max(1, this.page_number - 1);
  };

  @observable wfsResponse: WfsResponse;

  @observable page_number: number = 1;

  @observable page_size: number = 10;

  @computed get total_features(): number {
    return this.wfsResponse ? this.wfsResponse.totalFeatures : 0;
  }

  @computed get total_pages(): number {
    return Math.ceil(this.total_features / this.page_size);
  }

  @computed get current_page_content(): Annotation[] {
    return this.wfsResponse && this.wfsResponse.features ? this.wfsResponse.features : [];
  }

  @computed get offset(): number {
    return (this.page_number - 1) * this.page_size;
  }

  @computed get cql_filter(): string {
    const bits = [];
    if (this.taxonomyStore.activated_status_filters_cql.length > 0) {
      bits.push(this.taxonomyStore.activated_status_filters_cql);
    }
    if (this.taxonomyStore.taxonomy_class_id_selection_cql.length > 0) {
      bits.push(this.taxonomyStore.taxonomy_class_id_selection_cql);
    }
    const ownershipFiltersArray = Object.values(this.uiStore.annotationOwnershipFilters);
    if (this.geoImageNetStore.logged_user) {
      // $FlowFixMe
      const cqlOwnership = make_annotation_ownership_cql_filter(ownershipFiltersArray, this.geoImageNetStore.logged_user);
      if (cqlOwnership.length > 0) {
        bits.push(cqlOwnership);
      }
    }
    if (bits.length === 0) {
      return '';
    }
    return `&cql_filter=(${bits.join(') AND (')})`;
  }


}
