// @flow
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {
    withStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Paper
} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';

import {Actions} from './Actions.js';
import {Viewer} from './Taxonomy/Viewer';
import {AnnotationStatusFilter} from './AnnotationStatusFilter.js';
import {MapContainer} from './Map/MapContainer';
import {GeoImageNetStore} from "../store/GeoImageNetStore";
import {UserInteractions} from '../domain/user-interactions.js';
import {StoreActions} from '../store';

const StyledPanelDetails = withStyles({
    root: {
        flexDirection: 'column'
    },
})(ExpansionPanelDetails);

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

const ActiveFiltersBox = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            marginRight: values.gutterSmall,
            gridRow: '2/3',
            gridColumn: '2/3',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
        }
    };
})(props => {
    const {classes, children} = props;
    return <div className={classes.root}>{children}</div>;
});

const Sidebar = withStyles({
    root: {
        gridRow: '1/3',
        gridColumn: '3/4',
        padding: 0,
    },
})(Paper);

const SidebarBottom = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            height: `calc(100% - ${values.heightActionsBar})`,
            overflowY: 'scroll',
        }
    };
})(props => {
    const {classes, children} = props;
    return <div className={classes.root}>{children}</div>;
});

type Props = {
    state_proxy: GeoImageNetStore,
    store_actions: StoreActions,
    user_interactions: UserInteractions,
};
type State = {
    opened_panel_title: string,
};

/**
 * The Platform is the top level component for the annotation platform. It is responsible for managing the map, hence
 * the map manager is instantiated from here, after the component is mounted. We need to wait for the map elements to exist
 * or there would be nothing to mount the map onto.
 */
@observer
class Platform extends Component<Props, State> {

    state = {
        opened_panel_title: '',
    };

    create_open_panel_handler = (panel_title: string) => (event: Event, panel_should_open: boolean) => {
        this.setState({
            opened_panel_title: panel_should_open ? panel_title : '',
        });
    };

    render() {

        const {opened_panel_title} = this.state;

        return (
            <PlatformContainer>
                <MapContainer
                    state_proxy={this.props.state_proxy}
                    store_actions={this.props.store_actions}
                    user_interactions={this.props.user_interactions} />
                <Coordinates id='coordinates' />
                <ActiveFiltersBox>
                    <AnnotationStatusFilter store_actions={this.props.store_actions}
                                            state_proxy={this.props.state_proxy} />
                </ActiveFiltersBox>
                <Sidebar>
                    <Actions state_proxy={this.props.state_proxy}
                             store_actions={this.props.store_actions} />
                    <SidebarBottom>
                        <ExpansionPanel expanded={opened_panel_title === 'taxonomies'}
                                        onChange={this.create_open_panel_handler('taxonomies')}>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                Taxonomies and Classes
                            </ExpansionPanelSummary>
                            <StyledPanelDetails>
                                <Viewer
                                    refresh_source_by_status={this.props.user_interactions.refresh_source_by_status}
                                    state_proxy={this.props.state_proxy}
                                    user_interactions={this.props.user_interactions}
                                    store_actions={this.props.store_actions} />
                            </StyledPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={opened_panel_title === 'layers'}
                                        onChange={this.create_open_panel_handler('layers')}>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                Basemaps, Images and Filters
                            </ExpansionPanelSummary>
                            <StyledPanelDetails>
                                <div id='layer-switcher' className='layer-switcher-container' />
                            </StyledPanelDetails>
                        </ExpansionPanel>
                    </SidebarBottom>
                </Sidebar>
            </PlatformContainer>
        );
    }
}

export {
    Platform
};
