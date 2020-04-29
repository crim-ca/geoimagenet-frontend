/* eslint-disable consistent-return */
// @flow strict
import React from 'react';
import { observer } from 'mobx-react';
import { NotificationManager } from 'react-notifications';
import { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { compose } from 'react-apollo';
import { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import { ANNOTATION_THUMBNAIL_SIZE, MODE } from '../../constants';
import { Annotation as AnnotationComponent } from './Annotation';
import type { UserInteractions } from '../../domain';
import type { Annotation as AnnotationEntity, AnnotationStatus, BoundingBox } from '../../Types';
import type { UserInterfaceStore } from '../../model/store/UserInterfaceStore';
import type { AnnotationBrowserStore } from '../../model/store/AnnotationBrowserStore';
import { withAnnotationBrowserStore, withUserInterfaceStore } from '../../model/HOCs';
import { withTranslation } from '../../utils/index';

type Props = {
  uiStore: UserInterfaceStore,
  geoserver_url: string,
  geoImageNetStore: GeoImageNetStore,
  annotationBrowserStore: AnnotationBrowserStore,
  fitViewToBoundingBox: (BoundingBox, AnnotationStatus, number) => void,
  makeToggleAnnotationSelection: (number) => () => void,
  userInteractions: UserInteractions,
  t: TFunction,
  classes: {
    list: {},
    figure: {},
    list_item: {},
    info: {},
    rootDiv: {},
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
  rootDiv: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridGap: theme.values.gutterSmall,
  },
});

@observer
class AnnotationList extends React.Component<Props> {
  releasePage = () => {
    const { annotationBrowserStore: { currentPageContent }, userInteractions } = this.props;
    const annotationIds = [];
    const taxonomyClassIds = [];
    currentPageContent.map((annotation) => {
      const {
        id,
        taxonomy_class_id,
      } = annotation.properties;
      annotationIds.push(id);
      if (!taxonomyClassIds.includes(taxonomy_class_id)) {
        taxonomyClassIds.push(taxonomy_class_id);
      }
    });
    userInteractions.release_page_annotations(annotationIds, taxonomyClassIds);
  };

  validatePage = () => {
    const { annotationBrowserStore: { currentPageContent, selection }, userInteractions } = this.props;
    const validAnnotIds = [];
    const rejectedAnnotIds = [];
    const taxonomyClassIds = [];
    currentPageContent.map((annotation) => {
      const {
        id,
        taxonomy_class_id,
      } = annotation.properties;
      if (selection[id] === true) {
        validAnnotIds.push(id);
      } else {
        rejectedAnnotIds.push(id);
      }
      if (!taxonomyClassIds.includes(taxonomy_class_id)) {
        taxonomyClassIds.push(taxonomy_class_id);
      }
    });
    userInteractions.validation_of_page_annotation(validAnnotIds, rejectedAnnotIds, taxonomyClassIds);
  };

  handleClick = () => {
    const {
      annotationBrowserStore: { currentPageContent },
      uiStore: { isInReleaseMode, isInValidationMode },
    } = this.props;
    if (currentPageContent.length > 0) {
      if (isInReleaseMode) {
        this.releasePage();
      }
      if (isInValidationMode) {
        this.validatePage();
      }
    } else {
      NotificationManager.warning('There are no annotations in the current page');
    }
  }

  render() {
    const {
      geoImageNetStore: { imagesDictionary, user: { nicknamesMap } },
      uiStore: { isInEvaluationMode, isInReleaseMode },
      classes,
      fitViewToBoundingBox,
      annotationBrowserStore: { selection, currentPageContent },
      makeToggleAnnotationSelection,
      geoserver_url,
      t,
    } = this.props;


    return (
      <div className={classes.rootDiv}>
        <div className={classes.list}>
          {currentPageContent.map((annotation, i) => {
            const {
              image_id,
              bbox,
              id,
              status,
              taxonomy_class_id,
              annotator_id,
            } = annotation.properties;
            const clickedImage = imagesDictionary.find((image) => image.id === image_id);
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
                selected={selection[id] === true}
                toggle={makeToggleAnnotationSelection(id)}
                fitViewToBoundingBox={fitViewToBoundingBox}
                taxonomyClassId={taxonomy_class_id}
                featureUrl={featureUrl}
                annotator={annotator}
              />
            );
          })}
        </div>
        {
          isInEvaluationMode
            ? (
              <Button variant="contained" color="primary" onClick={this.handleClick}>
                {
                  isInReleaseMode
                    ? (
                      'Release current page\'s annotations'
                    ) : 'Validate/Reject current page\'s annotations'
                }
              </Button>
            ) : null
        }
      </div>
    );
  }
}

const component = compose(
  withStyles(style),
  withUserInterfaceStore,
  withAnnotationBrowserStore,
  withTranslation('annotations'),
)(AnnotationList);

export {
  component as AnnotationList,
};
