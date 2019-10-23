// @flow strict

import {GeoImageNetStore} from "./GeoImageNetStore";
import {TaxonomyStore} from "./TaxonomyStore";
import {AnnotationBrowserStore} from "./AnnotationBrowserStore";
import {DataQueries} from "../domain/data-queries";

export const data_queries = new DataQueries(GEOIMAGENET_API_URL, GEOSERVER_URL, MAGPIE_ENDPOINT, ML_ENDPOINT);
export const state_proxy = new GeoImageNetStore();
export const taxonomy_store = new TaxonomyStore(state_proxy);
export const annotation_browser_store = new AnnotationBrowserStore(GEOSERVER_URL, ANNOTATION_NAMESPACE, ANNOTATION_LAYER, state_proxy, taxonomy_store, data_queries);
