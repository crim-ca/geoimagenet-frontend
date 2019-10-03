// @flow strict

import {action, observable, configure} from 'mobx';

import type {BoundingBox, Coordinate} from '../Types';
import {VIEW_CENTER} from "../domain/constants";
import type Collection from "ol/Collection";
import type Feature from "ol/Feature";

configure({
    enforceActions: 'always',
});

export class OpenLayersStore {

    constructor(selected_features_collection: Collection) {
        this.set_selected_features_collection(selected_features_collection);
    }

    @action set_center: (Coordinate) => void = (center: Coordinate) => {
        this.center = center;
    };
    @action set_extent: (BoundingBox) => void = (bounding_box: BoundingBox) => {
        this.extent = bounding_box;
    };
    @action set_zoom: (number) => void = (zoom: number) => {
        this.resolution = zoom;
    };
    @action select_feature(feature: Feature) {
        this.selected_features.clear();
        this.selected_features.push(feature);
    }
    @action clear_selected_features() {
        this.selected_features.clear();
    }
    @action set_selected_features_collection(selected_features_collection: Collection) {
        this.selected_features = selected_features_collection;
    }

    @observable zoom_level: number = VIEW_CENTER.ZOOM_LEVEL;
    @observable center: Coordinate = VIEW_CENTER.CENTRE;
    @observable resolution: number;
    @observable extent: BoundingBox;
    @observable selected_features: Collection;

}
