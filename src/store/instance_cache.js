// @flow strict

import {GeoImageNetStore} from "./GeoImageNetStore";
import {TaxonomyStore} from "./TaxonomyStore";
import {AnnotationBrowserStore} from "./AnnotationBrowserStore";

export let state_proxy = new GeoImageNetStore();
export let taxonomy_store = new TaxonomyStore(state_proxy);
export let annotation_browser_store = new AnnotationBrowserStore(GEOSERVER_URL, ANNOTATION_NAMESPACE, ANNOTATION_LAYER, state_proxy, taxonomy_store);
