// @flow strict
import React from 'react';
import { withStyles } from '@material-ui/core';
import type { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';
import { withTranslation } from '../../utils';
import type { AnnotationStatus, BoundingBox } from '../../Types';
import { SelectionToggle } from './SelectionToggle';
import { observer } from 'mobx-react';

type Props = {
  t: TFunction,
  fitViewToBoundingBox: (BoundingBox, AnnotationStatus, number) => void,
  bbox: string,
  status: string,
  id: string,
  imageUrl: string,
  featureUrl: string,
  taxonomyClassId: number,
  annotator: string,
  selected: boolean,
  toggle: () => void,
  classes: {
    listItem: {},
    figure: {},
    info: {},
  },
};
const style = (theme) => ({
  figure: {
    position: 'relative',
    '& > img': {
      cursor: 'pointer',
      position: 'absolute',
      top: 0,
      left: 0,
    },
  },
  listItem: {
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
class Annotation extends React.Component<Props> {
  makeAnimateHandler = (boundingBox: BoundingBox, status: AnnotationStatus, annotationId: number) => () => {
    const { fitViewToBoundingBox } = this.props;
    fitViewToBoundingBox(boundingBox, status, annotationId);
  };

  render() {
    const {
      t,
      bbox,
      status,
      id,
      imageUrl,
      featureUrl,
      taxonomyClassId,
      annotator,
      selected,
      toggle,
      classes: { listItem, figure, info },
    } = this.props;
    return (
      <div className={listItem}>
        <figure className={figure} onClick={this.makeAnimateHandler(bbox, status, id)}>
          <img src={encodeURI(imageUrl)} />
          <img src={encodeURI(featureUrl)} />
        </figure>
        <div className={info}>
          <span style={{ fontWeight: 'bold' }}>{t(`taxonomy_classes:${taxonomyClassId}`)}</span>
          <span>{t(`status:singular.${status}`)}</span>
          <span>{t('annotations:created_by', { annotator })}</span>
          <SelectionToggle
            selected={selected}
            toggle={toggle}
          />
        </div>
      </div>
    );
  }
}

const component = compose(
  withStyles(style),
  withTranslation(),
)(Annotation);
export {
  component as Annotation,
};
