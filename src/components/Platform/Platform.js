// @flow strict
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles, Paper } from '@material-ui/core';
import { MapContainer } from '../Map/MapContainer';
import { UserInteractions } from '../../domain/user-interactions';
import { StoreActions } from '../../store/StoreActions';
import { Sidebar } from '../Sidebar';
import type { GeoImageNetStore } from '../../store/GeoImageNetStore';
import type { OpenLayersStore } from '../../store/OpenLayersStore';
import { Container as FiltersContainer } from '../Map/Filters/Container';
import { Container as LabelsContainer } from '../Map/LabelsChoice/Container';
import { ActiveFiltersBox } from '../Map/ActiveFiltersBox';
import type { TaxonomyStore } from '../../store/TaxonomyStore';
import { withTaxonomyStore } from '../../store/HOCs';

const PlatformContainer = withStyles(({ values }) => ({
  root: {
    display: 'grid',
    height: '100%',
    gridTemplateColumns: `1fr min-content ${values.widthSidebar}`,
    gridTemplateRows: '64px calc(100% - 64px)'
  }
}))(({ classes, children }) => (<div className={classes.root}>{children}</div>));

const Coordinates = withStyles(({ values, zIndex }) => ({
  root: {
    gridRow: '1/2',
    gridColumn: '2/3',
    zIndex: zIndex.over_map,
    padding: values.gutterSmall,
    margin: values.gutterSmall,
    width: '300px',
  }
}))(Paper);

type Props = {|
  state_proxy: GeoImageNetStore,
  store_actions: StoreActions,
  taxonomy_store: TaxonomyStore,
  user_interactions: UserInteractions,
  open_layers_store: OpenLayersStore,
|};

/**
 * The Platform is the top level component for the annotation platform. It is responsible for managing the map, hence
 * the map manager is instantiated from here, after the component is mounted. We need to wait for the map elements to exist
 * or there would be nothing to mount the map onto.
 */
@observer
class Platform extends Component<Props> {

  render() {
    return (
      <PlatformContainer>
        <MapContainer
          open_layers_store={this.props.open_layers_store}
          state_proxy={this.props.state_proxy}
          taxonomy_store={this.props.taxonomy_store}
          store_actions={this.props.store_actions}
          user_interactions={this.props.user_interactions} />
        <Coordinates id='coordinates' />
        <ActiveFiltersBox>
          <LabelsContainer state_proxy={this.props.state_proxy} store_actions={this.props.store_actions} />
          <FiltersContainer state_proxy={this.props.state_proxy} store_actions={this.props.store_actions} />
        </ActiveFiltersBox>
        <Sidebar
          open_layers_store={this.props.open_layers_store}
          state_proxy={this.props.state_proxy}
          user_interactions={this.props.user_interactions}
          store_actions={this.props.store_actions} />
      </PlatformContainer>
    );
  }
}

const component = withTaxonomyStore(Platform);
export {
  component as Platform
};
