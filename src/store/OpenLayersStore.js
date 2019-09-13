// @flow strict

import {action, observable, configure} from 'mobx';
import type {BoundingBox, Coordinate} from '../Types';

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

    @observable center: Coordinate;
    @observable resolution: number;

}
