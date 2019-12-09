// @flow strict

import React from 'react';
import { observer } from 'mobx-react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'react-apollo';

import { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import { ANNOTATION_THUMBNAIL_SIZE } from '../../constants';
import { Annotation as AnnotationComponent } from './Annotation';

import type { Annotation as AnnotationEntity, AnnotationStatus, BoundingBox } from '../../Types';

type Props = {
  annotations: AnnotationEntity[],
  geoserver_url: string,
  geoImageNetStore: GeoImageNetStore,
  fit_view_to_bounding_box: (BoundingBox, AnnotationStatus, number) => void,
  classes: {
    list: {},
    figure: {},
    list_item: {},
    info: {},
  },
};
const style = (theme) => ({
  list: {
    display: 'grid',
    '& tr:not(:first-child) > *': {
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
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
    },
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
  render() {
    const {
      geoImageNetStore: { images_dictionary, user: { nicknamesMap } },
      classes,
      annotations,
      fit_view_to_bounding_box,
      geoserver_url,
    } = this.props;
    return (
      <div className={classes.list}>
        {annotations.map((annotation, i) => {
          const {
            image_id,
            bbox,
            id,
            status,
            taxonomy_class_id,
            annotator_id,
          } = annotation.properties;
          const clickedImage = images_dictionary.find((image) => image.id === image_id);
          if (clickedImage === undefined) {
            return;
          }
          const boundingBox = bbox.join(',');
          const imageUrl = `${geoserver_url}/wms?service=WMS&version=1.3.0&request=GetMap&format=image/png`
            + `&transparent=true&layers=${clickedImage.layer_name}&hints=quality`
            + `&width=${ANNOTATION_THUMBNAIL_SIZE}&height=${ANNOTATION_THUMBNAIL_SIZE}`
            + `&crs=EPSG:3857&bbox=${boundingBox}`;
          const featureUrl = `${geoserver_url}/wms?request=GetMap&service=WMS&version=1.3.0`
            + '&transparent=true&layers=annotation&srs=EPSG:3857'
            + `&WIDTH=${ANNOTATION_THUMBNAIL_SIZE}&HEIGHT=${ANNOTATION_THUMBNAIL_SIZE}`
            + `&styles=annotations&format=image/png&BBOX=${boundingBox}&cql_filter=id=${id}`;
          const annotator = nicknamesMap[annotator_id] || annotator_id;
          return (
            <AnnotationComponent
              key={i}
              bbox={bbox}
              status={status}
              imageUrl={imageUrl}
              id={id}
              fitViewToBoundingBox={fit_view_to_bounding_box}
              taxonomyClassId={taxonomy_class_id}
              featureUrl={featureUrl}
              annotator={annotator}
            />
          );
        })}
      </div>
    );
  }
}

const component = compose(
  withStyles(style),
)(AnnotationList);

export {
  component as AnnotationList,
};
