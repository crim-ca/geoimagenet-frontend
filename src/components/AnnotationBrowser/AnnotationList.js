// @flow strict

import React from 'react';
import {observer} from 'mobx-react';
import Button from '@material-ui/core/Button';

import type {Annotation, BoundingBox} from "../../Types";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";

type Props = {
    annotations: Annotation[],
    geoserver_url: string,
    state_proxy: GeoImageNetStore,
    fit_view_to_bounding_box: (BoundingBox) => void,
};

@observer
class AnnotationList extends React.Component<Props> {

    make_animate_handler = (bounding_box: BoundingBox) => () => {
        this.props.fit_view_to_bounding_box(bounding_box);
    };

    render() {
        return (
            <>
                {this.props.annotations.map((annotation, i) => {
                    const image = this.props.state_proxy.images_dictionary.find(image => image.id === annotation.properties.image_id);
                    const url = `${this.props.geoserver_url}/wms?service=WMS&version=1.3.0&request=GetMap&format=image/png` +
                        `&transparent=true&layers=${image.layer_name}&hints=quality` +
                        `&width=150&height=150&crs=EPSG:3857&bbox=${annotation.properties.bbox.join(',')}`;
                    return (
                        <div key={i}>
                            <img src={encodeURI(url)} />
                            <Button onClick={this.make_animate_handler(annotation.properties.bbox)}>localize</Button>
                        </div>
                    );
                })}
            </>
        );
    }
}

export {
    AnnotationList,
};
