// @flow strict

import {action, observable, configure} from 'mobx';

import type {BoundingBox, Coordinate} from '../Types';
import {VIEW_CENTER} from "../domain/constants";

configure({
    enforceActions: 'always',
});

export class OpenLayersStore {

    @action set_center: (Coordinate) => void = (center: Coordinate) => {
        this.center = center;
    };
    @action set_zoom: (number) => void = (zoom: number) => {
        this.resolution = zoom;
    };

    @observable zoom_level: number = VIEW_CENTER.ZOOM_LEVEL;
    @observable center: Coordinate = VIEW_CENTER.CENTRE;
    @observable resolution: number;

}
