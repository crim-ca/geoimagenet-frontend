// @flow strict

import React from 'react';
import {observer} from 'mobx-react';
import withStyles from '@material-ui/core/styles/withStyles';
import {TFunction} from 'react-i18next';

import type {Annotation, AnnotationStatus, BoundingBox} from "../../Types";
import {withTranslation} from '../../utils';
import {GeoImageNetStore} from "../../store/GeoImageNetStore";

type Props = {
    annotations: Annotation[],
    geoserver_url: string,
    state_proxy: GeoImageNetStore,
    fit_view_to_bounding_box: (BoundingBox, AnnotationStatus, number) => void,
    classes: {
        list: {},
        figure: {},
        list_item: {},
    },
    t: TFunction,
};
const style = (theme) => ({
    list: {
        display: 'flex',
        flexDirection: 'column',
        '& th': {
            textAlign: 'right',
        },
        '& tr:not(:first-child) > *': {
            borderTop: '1px solid rgba(0, 0, 0, 0.1)'
        },
    },
    figure: {
        position: 'relative',
        '& > img': {
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
        }
    },
    list_item: {
        display: 'grid',
        gridGap: theme.values.gutterSmall,
        gridTemplateColumns: '150px 1fr',
        gridTemplateRows: `calc(150px + ${theme.values.gutterSmall})`,
    }
});

@observer
class AnnotationList extends React.Component<Props> {

    make_animate_handler = (bounding_box: BoundingBox, status: AnnotationStatus, annotation_id: number) => () => {
        this.props.fit_view_to_bounding_box(bounding_box, status, annotation_id);
    };

    render() {
        const {classes, state_proxy, t} = this.props;
        return (
            <div className={classes.list}>
                {this.props.annotations.map((annotation, i) => {
                    const {image_id, bbox, id, status, taxonomy_class_id, annotator_id} = annotation.properties;
                    const taxonomy_class_name = state_proxy.flat_taxonomy_classes[taxonomy_class_id].name_en;
                    const image = this.props.state_proxy.images_dictionary.find(image => image.id === image_id);
                    if (image === undefined) {
                        return;
                    }
                    const bounding_box = bbox.join(',');
                    const image_url = `${this.props.geoserver_url}/wms?service=WMS&version=1.3.0&request=GetMap&format=image/png` +
                        `&transparent=true&layers=${image.layer_name}&hints=quality` +
                        `&width=150&height=150&crs=EPSG:3857&bbox=${bounding_box}`;
                    const feature_url = `${this.props.geoserver_url}/wms?request=GetMap&service=WMS&version=1.3.0` +
                        `&transparent=true&layers=annotation&srs=EPSG:3857&WIDTH=150&HEIGHT=150&styles=annotations&format=image/png` +
                        `&BBOX=${bounding_box}&cql_filter=id=${id}`;
                    return (
                        <div key={i} className={classes.list_item}>
                            <figure className={classes.figure} onClick={this.make_animate_handler(bbox, status, id)}>
                                <img src={encodeURI(image_url)} />
                                <img src={encodeURI(feature_url)} />
                            </figure>
                            <table>
                                <tbody>
                                <tr>
                                    <th>{t('annotations:class_name')}:</th>
                                    <td>{taxonomy_class_name}</td>
                                </tr>
                                <tr>
                                    <th>{t('annotations:status')}:</th>
                                    <td>{status}</td>
                                </tr>
                                <tr>
                                    <th>{t('annotations:owner')}:</th>
                                    <td>{annotator_id}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        );
    }
}

const styled_annotations = withStyles(style)(AnnotationList);
const translated_annotations = withTranslation()(styled_annotations);

export {
    translated_annotations as AnnotationList,
};