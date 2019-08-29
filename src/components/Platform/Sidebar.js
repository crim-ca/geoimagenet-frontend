// @flow strict

import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Paper, withStyles} from "@material-ui/core";
import {Actions} from "../Actions";
import {ExpandMore} from "@material-ui/icons";
import {Viewer} from "../Taxonomy/Viewer";
import React from "react";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {StoreActions} from "../../store/StoreActions";
import {UserInteractions} from "../../domain";

const SidebarSection = withStyles({
    root: {
        gridRow: '1/3',
        gridColumn: '3/4',
        padding: 0,
    },
})(Paper);

const StyledPanelDetails = withStyles({
    root: {
        flexDirection: 'column'
    },
})(ExpansionPanelDetails);

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

export class Sidebar extends React.Component<Props, State> {

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
            <SidebarSection>
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
            </SidebarSection>
        );
    }
}
