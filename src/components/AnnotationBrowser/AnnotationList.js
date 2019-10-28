// @flow strict

import React from 'react';
import { observer } from 'mobx-react';
import withStyles from '@material-ui/core/styles/withStyles';
import { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';

import { withTranslation } from '../../utils';
import { GeoImageNetStore } from '../../store/GeoImageNetStore';
import { ANNOTATION_THUMBNAIL_SIZE } from '../../constants';

import type { Annotation, AnnotationStatus, BoundingBox } from '../../Types';

type Props = {
  annotations: Annotation[],
  geoserver_url: string,
  state_proxy: GeoImageNetStore,
  fit_view_to_bounding_box: (BoundingBox, AnnotationStatus, number) => void,
  classes: {
    list: {},
    figure: {},
    list_item: {},
    info: {},
  },
  t: TFunction,
};
const style = (theme) => ({
  list: {
    display: 'grid',
    '& tr:not(:first-child) > *': {
      borderTop: '1px solid rgba(0, 0, 0, 0.1)'
    },
    gridTemplateColumns: '1fr 1fr',
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
    gridTemplateColumns: `${theme.values.annotation_size} 1fr`,
    gridTemplateRows: `calc(${theme.values.annotation_size} + ${theme.values.gutterSmall})`,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'start',
  },
});

@observer
class AnnotationList extends React.Component<Props> {

  make_animate_handler = (bounding_box: BoundingBox, status: AnnotationStatus, annotation_id: number) => () => {
    this.props.fit_view_to_bounding_box(bounding_box, status, annotation_id);
  };

  render() {
    const { images_dictionary, nickname_map } = this.props.state_proxy;
    const { classes, t } = this.props;
    return (
      <div className={classes.list}>
        {this.props.annotations.map((annotation, i) => {
          const { image_id, bbox, id, status, taxonomy_class_id, annotator_id } = annotation.properties;
          const image = images_dictionary.find(image => image.id === image_id);
          if (image === undefined) {
            return;
          }
          const bounding_box = bbox.join(',');
          const image_url = `${this.props.geoserver_url}/wms?service=WMS&version=1.3.0&request=GetMap&format=image/png` +
            `&transparent=true&layers=${image.layer_name}&hints=quality` +
            `&width=${ANNOTATION_THUMBNAIL_SIZE}&height=${ANNOTATION_THUMBNAIL_SIZE}&crs=EPSG:3857&bbox=${bounding_box}`;
          const feature_url = `${this.props.geoserver_url}/wms?request=GetMap&service=WMS&version=1.3.0` +
            `&transparent=true&layers=annotation&srs=EPSG:3857&WIDTH=${ANNOTATION_THUMBNAIL_SIZE}&HEIGHT=${ANNOTATION_THUMBNAIL_SIZE}` +
            `&styles=annotations&format=image/png&BBOX=${bounding_box}&cql_filter=id=${id}`;
          const annotator = nickname_map[annotator_id] || annotator_id;
          return (
            <div key={i} className={classes.list_item}>
              <figure className={classes.figure} onClick={this.make_animate_handler(bbox, status, id)}>
                <img src={encodeURI(image_url)} />
                <img src={encodeURI(feature_url)} />
              </figure>
              <div className={classes.info}>
                <span style={{ fontWeight: 'bold' }}>{t(`taxonomy_classes:${taxonomy_class_id}`)}</span>
                <span>{t(`status:singular.${status}`)}</span>
                <span>{t('annotations:created_by', { annotator })}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

const component = compose(
  withStyles(style),
  withTranslation(),
)(AnnotationList);

export {
  component as AnnotationList,
};
