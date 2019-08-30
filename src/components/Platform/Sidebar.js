// @flow strict

import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Paper, withStyles} from "@material-ui/core";
import {Actions} from "../Actions";
import {ExpandMore} from "@material-ui/icons";
import {Viewer} from "../Taxonomy/Viewer";
import React from "react";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {StoreActions} from "../../store/StoreActions";
import {UserInteractions} from "../../domain";
import {Container as SettingsContainer} from '../UserSettings/Container';

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

type SidebarSectionData = {
    title: string,
    slug: string,
    content: {},
};

const make_sidebar_sections: (UserInteractions, GeoImageNetStore, StoreActions) => SidebarSectionData[] = (
    user_interactions,
    state_proxy,
    store_actions,
) => {
    const sections = [
        {
            title: 'Taxonomies and Classes',
            slug: 'taxonomies',
            content: (
                <Viewer
                    refresh_source_by_status={user_interactions.refresh_source_by_status}
                    state_proxy={state_proxy}
                    user_interactions={user_interactions}
                    store_actions={store_actions} />
            ),
        },
        {
            title: 'Basemaps, Images and Filters',
            slug: 'layers',
            content: (<div id='layer-switcher' className='layer-switcher-container' />),
        },
    ];
    if (state_proxy.logged_user !== null) {
        sections.push({
            title: 'Settings',
            slug: 'settings',
            content: (<SettingsContainer user={state_proxy.logged_user} />),
        });
    }
    return sections;
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
        const sidebar_sections = make_sidebar_sections(this.props.user_interactions, this.props.state_proxy, this.props.store_actions);
        return (
            <SidebarSection>
                <Actions state_proxy={this.props.state_proxy}
                         store_actions={this.props.store_actions} />
                <SidebarBottom>
                    {
                        sidebar_sections.map((section, i) => (
                            <ExpansionPanel key={i}
                                            expanded={opened_panel_title === section.slug}
                                            onChange={this.create_open_panel_handler(section.slug)}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMore />}>{section.title}</ExpansionPanelSummary>
                                <StyledPanelDetails>{section.content}</StyledPanelDetails>
                            </ExpansionPanel>
                        ))
                    }
                </SidebarBottom>
            </SidebarSection>
        );
    }
}
