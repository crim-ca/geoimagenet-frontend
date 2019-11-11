// @flow strict
import { DataQueries } from '../domain/data-queries';
import { GeoImageNetStore } from './store/GeoImageNetStore';
import { TaxonomyStore } from './store/TaxonomyStore';
import { AnnotationBrowserStore } from './store/AnnotationBrowserStore';
import { UserInterfaceStore } from './store/UserInterfaceStore';

export const dataQueries = new DataQueries(GEOIMAGENET_API_URL, GEOSERVER_URL, MAGPIE_ENDPOINT, ML_ENDPOINT);
export const geoImageNetStore = new GeoImageNetStore();
export const uiStore = new UserInterfaceStore();
export const taxonomyStore = new TaxonomyStore(uiStore);
export const annotationBrowserStore = new AnnotationBrowserStore(
  GEOSERVER_URL,
  ANNOTATION_NAMESPACE,
  ANNOTATION_LAYER,
  geoImageNetStore,
  uiStore,
  taxonomyStore,
  dataQueries,
);
