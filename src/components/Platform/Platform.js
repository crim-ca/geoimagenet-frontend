// @flow
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {withStyles, Paper} from '@material-ui/core';
import {MapContainer} from '../Map/MapContainer';
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {UserInteractions} from '../../domain/user-interactions.js';
import {StoreActions} from '../../store/StoreActions';
import {Sidebar} from './Sidebar';
import {Container as FiltersContainer} from "../Map/Filters/Container";
import {Container as LabelsContainer} from "../Map/LabelsChoice/Container";
import {ActiveFiltersBox} from '../Map/ActiveFiltersBox';

const PlatformContainer = withStyles(({values}) => ({
    root: {
        display: 'grid',
        height: '100%',
        gridTemplateColumns: `1fr min-content ${values.widthSidebar}`,
        gridTemplateRows: '64px calc(100% - 64px)'
    }
}))(({classes, children}) => (<div className={classes.root}>{children}</div>));

const Coordinates = withStyles(({values, zIndex}) => ({
    root: {
        gridRow: '1/2',
        gridColumn: '2/3',
        zIndex: zIndex.over_map,
        padding: values.gutterSmall,
        margin: values.gutterSmall,
        width: '300px',
    }
}))(Paper);

type Props = {
    state_proxy: GeoImageNetStore,
    store_actions: StoreActions,
    user_interactions: UserInteractions,
};

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
                    state_proxy={this.props.state_proxy}
                    store_actions={this.props.store_actions}
                    user_interactions={this.props.user_interactions} />
                <Coordinates id='coordinates' />
                <ActiveFiltersBox>
                    <LabelsContainer state_proxy={this.props.state_proxy} store_actions={this.props.store_actions} />
                    <FiltersContainer state_proxy={this.props.state_proxy} store_actions={this.props.store_actions} />
                </ActiveFiltersBox>
                <Sidebar
                    state_proxy={this.props.state_proxy}
                    user_interactions={this.props.user_interactions}
                    store_actions={this.props.store_actions} />
            </PlatformContainer>
        );
    }
}

export {
    Platform
};
