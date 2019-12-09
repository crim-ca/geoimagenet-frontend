// @flow strict

import React from 'react';
import { autorun } from 'mobx';
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

type Props = {
  annotationBrowserStore: AnnotationBrowserStore,
  geoImageNetStore: GeoImageNetStore,
  userInteractions: UserInteractions,
  openLayersStore: OpenLayersStore,
  classes: {
    root: {},
  },
};
const style = (theme) => ({
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
    if (window.fetch) {
      this.disposer = autorun(refreshContent);
    }
  }

  componentWillUnmount(): void {
    if (window.fetch) {
      this.disposer();
    }
  }

  navigate = (boundingBox: BoundingBox, status: AnnotationStatus, annotationId: number) => {
    const { openLayersStore, geoImageNetStore } = this.props;
    openLayersStore.set_extent(boundingBox);
    /**
     * TODO ugly hack so that the feature is actually in the viewport when we try to select it
     *
     * The fit to extent method operates over 800 milliseconds,
     * so 1200 here should be enough for it to finish when the transition is jerky
     */
    setTimeout(() => {
      const { annotations_collections } = geoImageNetStore;
      const feature = annotations_collections[status].getArray()
        .find((candidate) => candidate.get('id') === annotationId);
      if (feature === undefined) {
        return;
      }
      openLayersStore.select_feature(feature);
    }, 1200);
  };

  render() {
    const {
      geoImageNetStore,
      userInteractions,
      classes: { root },
      annotationBrowserStore: {
        pageNumber,
        totalPages,
        totalFeatures,
        nextPage,
        previousPage,
        currentPageContent,
        selection,
        toggleAnnotationSelection,
      },
    } = this.props;
    const makeToggleAnnotationSelection = (id: number) => () => {
      toggleAnnotationSelection(id);
    };
    return (
      <div className={root}>
        <WorkspaceContainer
          userInteractions={userInteractions}
          geoImageNetStore={geoImageNetStore}
        />
        <ModeSelectionContainer geoImageNetStore={geoImageNetStore} />
        <hr />
        <AnnotationList
          selection={selection}
          makeToggleAnnotationSelection={makeToggleAnnotationSelection}
          fit_view_to_bounding_box={this.navigate}
          annotations={currentPageContent}
          geoserver_url={GEOSERVER_URL}
          geoImageNetStore={geoImageNetStore}
        />
        <Paginator
          pageNumber={pageNumber}
          totalPages={totalPages}
          totalFeatures={totalFeatures}
          previousPage={previousPage}
          nextPage={nextPage}
        />
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
