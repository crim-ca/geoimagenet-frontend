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
  }

  refreshContent = async () => {
    const typeName = `${this.annotationNamespace}:${this.annotationLayer}`;
    const json = await this.dataQueries.get_annotations_browser_page(
      typeName,
      this.cqlFilter,
      this.pageSize.toString(10),
      this.offset.toString(10),
    );
    this.setWfsResponse(json);
  };

  @action setWfsResponse(wfsResponse: WfsResponse) {
    this.wfsResponse = wfsResponse;
    if (this.wfsResponse && this.wfsResponse.features) {
      this.selection = {};
      this.wfsResponse.features.map((feature) => feature.properties.id)
        .forEach((id) => {
          this.selection[id] = false;
        });
    }
  }

  @action nextPage = () => {
    this.pageNumber = Math.min(this.totalPages, this.pageNumber + 1);
  };

  @action previousPage = () => {
    this.pageNumber = Math.max(1, this.pageNumber - 1);
  };

  @action toggleAnnotationSelection = (id: number) => {
    this.selection[id] = !this.selection[id];
  };

  @action toggleAllAnnotationSelection = () => {
    const { selection, fullSelection } = this;
    const selected = !fullSelection;
    Object.keys(this.selection)
      .forEach((key) => {
        selection[key] = selected;
      });
  };

  @observable wfsResponse: WfsResponse;

  @observable pageNumber: number = 1;

  @observable pageSize: number = 10;

  @observable selection: {} = {};

  @computed get fullSelection(): boolean {
    return Object.values(this.selection)
      .every((value) => value === true);
  }

  @computed get totalFeatures(): number {
    return this.wfsResponse ? this.wfsResponse.totalFeatures : 0;
  }

  @computed get totalPages(): number {
    return Math.ceil(this.totalFeatures / this.pageSize);
  }

  @computed get currentPageContent(): Annotation[] {
    return this.wfsResponse && this.wfsResponse.features ? this.wfsResponse.features : [];
  }

  @computed get offset(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }

  @computed get cqlFilter(): string {
    const bits = [];
    if (this.taxonomyStore.activated_status_filters_cql.length > 0) {
      bits.push(this.taxonomyStore.activated_status_filters_cql);
    }
    if (this.taxonomyStore.taxonomy_class_id_selection_cql.length > 0) {
      bits.push(this.taxonomyStore.taxonomy_class_id_selection_cql);
    }
    const ownershipFiltersArray = Object.values(this.uiStore.annotationOwnershipFilters);
    if (this.geoImageNetStore.user) {
      // $FlowFixMe
      const cqlOwnership = make_annotation_ownership_cql_filter(ownershipFiltersArray, this.geoImageNetStore.user);
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
