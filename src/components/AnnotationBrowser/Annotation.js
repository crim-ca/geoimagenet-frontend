// @flow strict
import React from 'react';
import { withStyles } from '@material-ui/core';
import type { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';
import { observer } from 'mobx-react';
import { withTranslation } from '../../utils';
import type { AnnotationStatus, BoundingBox } from '../../Types';
import { SelectionToggle } from './SelectionToggle';
import { MODE } from '../../constants';
import { withUserInterfaceStore } from '../../model/HOCs';
import type { UserInterfaceStore } from '../../model/store/UserInterfaceStore';

type Props = {
  t: TFunction,
  selectedMode: string,
  uiStore: UserInterfaceStore,
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

  maybeMakeSelectionWidget() {
    const { uiStore: { selectedMode }, selected, toggle } = this.props;
    switch (selectedMode) {
      case MODE.DELETION:
      case MODE.RELEASE:
        return (
          <input
            type="checkbox"
            checked={selected}
            onChange={toggle}
          />
        );
      case MODE.VALIDATION:
        return (
          <SelectionToggle
            selected={selected}
            toggle={toggle}
          />
        );
      default:
        return null;
    }
  }

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
      uiStore: { isInBatchMode },
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
          {
            !isInBatchMode
              ? (
                <span>{t(`status:singular.${status}`)}</span>
              ) : null
          }
          <span>{t('annotations:created_by', { annotator })}</span>
          {this.maybeMakeSelectionWidget()}
        </div>
      </div>
    );
  }
}

const component = compose(
  withStyles(style),
  withTranslation(),
  withUserInterfaceStore,
)(Annotation);
export {
  component as Annotation,
};
