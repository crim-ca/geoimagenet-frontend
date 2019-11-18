// @flow strict

import React from 'react';
import { observer } from 'mobx-react';
import { compose } from 'react-apollo';
import withStyles from '@material-ui/core/styles/withStyles';

import { Paginator } from './Paginator';
import { AnnotationList } from './AnnotationList';
import { OpenLayersStore } from '../../model/store/OpenLayersStore';
import { Container as WorkspaceContainer } from './Workspace/Container';
import { withAnnotationBrowserStore } from '../../model/HOCs';
import { Container as ModeSelectionContainer } from '../ModeSelection/Container';

import type { AnnotationBrowserStore } from '../../model/store/AnnotationBrowserStore';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import type { AnnotationStatus, BoundingBox } from '../../Types';
import type { UserInteractions } from '../../domain';
import type { StoreActions } from '../../model/StoreActions';
import { autorun } from 'mobx';

type Props = {
  annotationBrowserStore: AnnotationBrowserStore,
  geoImageNetStore: GeoImageNetStore,
  userInteractions: UserInteractions,
  storeActions: StoreActions,
  openLayersStore: OpenLayersStore,
  classes: {
    root: {},
  },
};
const style = theme => ({
  root: {
    '& hr': {
      margin: `${theme.values.gutterMedium} -${theme.values.gutterMedium}`,
      borderTop: `1px solid ${theme.colors.turquoise}`,
      border: '0',
    },
  },
});

@observer
class Container extends React.Component<Props> {
  componentDidMount(): void {
    const { annotationBrowserStore: { refreshContent } } = this.props;
    this.disposer = autorun(refreshContent);
  }

  componentWillUnmount(): void {
    this.disposer();
  }

  navigate = (boundingBox: BoundingBox, status: AnnotationStatus, annotationId: number) => {
    this.props.openLayersStore.set_extent(boundingBox);
    /**
     * TODO ugly hack so that the feature is actually in the viewport when we try to select it
     *
     * The fit to extent method operates over 800 milliseconds, so 1200 here should be enough for it to finish when the transition is jerky
     */
    setTimeout(() => {
      const { annotations_collections } = this.props.geoImageNetStore;
      const feature = annotations_collections[status].getArray()
        .find(candidate => candidate.get('id') === annotationId);
      if (feature === undefined) {
        return;
      }
      this.props.openLayersStore.select_feature(feature);
    }, 1200);
  };

  render() {
    const {
      geoImageNetStore,
      userInteractions,
      annotationBrowserStore: {
        page_number,
        total_pages,
        total_features,
        next_page,
        previous_page,
        current_page_content,
      },
    } = this.props;
    return (
      <div className={this.props.classes.root}>
        <WorkspaceContainer userInteractions={userInteractions}
                            geoImageNetStore={geoImageNetStore}
        />
        <ModeSelectionContainer geoImageNetStore={geoImageNetStore} />
        <hr />
        <AnnotationList
          fit_view_to_bounding_box={this.navigate}
          annotations={current_page_content}
          geoserver_url={GEOSERVER_URL}
          geoImageNetStore={this.props.geoImageNetStore} />
        <Paginator page_number={page_number}
                   total_pages={total_pages}
                   total_features={total_features}
                   previous_page={previous_page}
                   next_page={next_page} />
      </div>
    );
  }
}

const component = compose(
  withStyles(style),
  withAnnotationBrowserStore,
)(Container);

export {
  component as Container,
};
