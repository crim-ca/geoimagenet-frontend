// @flow strict
import { DataQueries } from '../domain/data-queries';
import { GeoImageNetStore } from './store/GeoImageNetStore';
import { TaxonomyStore } from './store/TaxonomyStore';
import { AnnotationBrowserStore } from './store/AnnotationBrowserStore';
import { UserInterfaceStore } from './store/UserInterfaceStore';

export const dataQueries = new DataQueries(GEOIMAGENET_API_URL, GEOSERVER_URL, MAGPIE_ENDPOINT, ML_ENDPOINT);
export const geoImageNetStore = new GeoImageNetStore();
export const taxonomyStore = new TaxonomyStore(geoImageNetStore);
export const annotationBrowserStore = new AnnotationBrowserStore(GEOSERVER_URL, ANNOTATION_NAMESPACE, ANNOTATION_LAYER, geoImageNetStore, taxonomyStore, dataQueries);
export const uiStore = new UserInterfaceStore();
