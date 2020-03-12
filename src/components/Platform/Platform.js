// @flow strict
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles, Paper } from '@material-ui/core';
import { MapContainer } from '../Map/MapContainer';
import { UserInteractions } from '../../domain/user-interactions';
import { StoreActions } from '../../model/StoreActions';
import { Sidebar } from '../Sidebar';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import type { OpenLayersStore } from '../../model/store/OpenLayersStore';
import { Container as FiltersContainer } from '../Map/Filters/Container';
import { Container as OwnersContainer } from '../Map/Owners/Container';
import { Container as LabelsContainer } from '../Map/Labels/Container';
import { ActiveFiltersBox } from '../Map/ActiveFiltersBox';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';
import { withTaxonomyStore } from '../../model/HOCs';

const PlatformContainer = withStyles(({ values }) => ({
  root: {
    display: 'grid',
    height: '100%',
    gridTemplateColumns: `1fr min-content ${values.widthSidebar}`,
    gridTemplateRows: '64px calc(100% - 64px)',
  },
}))(({ classes, children }) => (<div className={classes.root}>{children}</div>));

const Coordinates = withStyles(({ values, zIndex }) => ({
  root: {
    gridRow: '1/2',
    gridColumn: '2/3',
    zIndex: zIndex.over_map,
    padding: values.gutterSmall,
    margin: values.gutterSmall,
    width: '300px',
  },
}))(Paper);

type Props = {|
  geoImageNetStore: GeoImageNetStore,
  storeActions: StoreActions,
  taxonomyStore: TaxonomyStore,
  userInteractions: UserInteractions,
  openLayersStore: OpenLayersStore,
|};

/**
 * The Platform is the top level component for the annotation platform. It is responsible for managing the map, hence
 * the map manager is instantiated from here, after the component is mounted. We need to wait for the map elements to exist
 * or there would be nothing to mount the map onto.
 */
@observer
class Platform extends Component<Props> {
  render() {
    const {
      geoImageNetStore,
      storeActions,
      taxonomyStore,
      userInteractions,
      openLayersStore,
    } = this.props;

    return (
      <PlatformContainer>
        <MapContainer
          openLayersStore={openLayersStore}
          geoImageNetStore={geoImageNetStore}
          taxonomyStore={taxonomyStore}
          storeActions={storeActions}
          userInteractions={userInteractions}
        />
        <Coordinates id='coordinates' />
        <ActiveFiltersBox>
          <OwnersContainer geoImageNetStore={geoImageNetStore} storeActions={storeActions} />
          <LabelsContainer geoImageNetStore={geoImageNetStore} storeActions={storeActions} />
          <FiltersContainer geoImageNetStore={geoImageNetStore} storeActions={storeActions} />
        </ActiveFiltersBox>
        <Sidebar
          openLayersStore={openLayersStore}
          geoImageNetStore={geoImageNetStore}
          userInteractions={userInteractions}
          storeActions={storeActions}
        />
      </PlatformContainer>
    );
  }
}

const component = withTaxonomyStore(Platform);
export {
  component as Platform,
};
