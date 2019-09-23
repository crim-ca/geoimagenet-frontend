// @flow strict

import React from 'react';
import {observer} from 'mobx-react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import type {Annotation, BoundingBox} from "../../Types";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";

type Props = {
    annotations: Annotation[],
    geoserver_url: string,
    state_proxy: GeoImageNetStore,
    fit_view_to_bounding_box: (BoundingBox) => void,
    classes: {
        root: {}
    },
};
const style = {
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    },
    item: {
        position: 'relative',
        height: '200px',
        '& > img': {
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
        }
    },
};

@observer
class AnnotationList extends React.Component<Props> {

    make_animate_handler = (bounding_box: BoundingBox) => () => {
        this.props.fit_view_to_bounding_box(bounding_box);
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                {this.props.annotations.map((annotation, i) => {
                    const image = this.props.state_proxy.images_dictionary.find(image => image.id === annotation.properties.image_id);
                    if (image === undefined) {
                        return;
                    }
                    const bounding_box = annotation.properties.bbox.join(',');
                    const image_url = `${this.props.geoserver_url}/wms?service=WMS&version=1.3.0&request=GetMap&format=image/png` +
                        `&transparent=true&layers=${image.layer_name}&hints=quality` +
                        `&width=150&height=150&crs=EPSG:3857&bbox=${bounding_box}`;
                    const feature_url = `${this.props.geoserver_url}/wms?request=GetMap&service=WMS&version=1.3.0` +
                        `&transparent=true&layers=annotation&srs=EPSG:3857&WIDTH=150&HEIGHT=150&format=image/png` +
                        `&BBOX=${bounding_box}&cql_filter=id=${annotation.properties.id}`;
                    return (
                        <figure className={classes.item}
                                key={i}
                                onClick={this.make_animate_handler(annotation.properties.bbox)}>
                            <img src={encodeURI(image_url)} />
                            <img src={encodeURI(feature_url)} />
                        </figure>
                    );
                })}
            </div>
        );
    }
}

const styled_annotations = withStyles(style)(AnnotationList);

export {
    styled_annotations as AnnotationList,
};
