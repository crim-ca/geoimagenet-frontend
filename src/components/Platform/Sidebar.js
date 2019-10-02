// @flow strict

import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Paper, withStyles} from "@material-ui/core";
import {Actions} from "../Actions";
import {ExpandMore} from "@material-ui/icons";
import {Viewer} from "../Taxonomy/Viewer";
import React from "react";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {AnnotationBrowserStore} from "../../store/AnnotationBrowserStore";
import {StoreActions} from "../../store/StoreActions";
import {UserInteractions} from "../../domain";
import {Container as SettingsContainer} from '../UserSettings/Container';
import {TFunction} from 'react-i18next';
import {withTranslation} from '../../utils';
import {Container as AnnotationBrowserContainer} from '../AnnotationBrowser/Container';
import {TaxonomyStore} from '../../store/TaxonomyStore';
import type {OpenLayersStore} from "../../store/OpenLayersStore";

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

type SidebarSectionData = {
    title: string,
    slug: string,
    content: {},
};

const make_sidebar_sections: (UserInteractions, GeoImageNetStore, TaxonomyStore, StoreActions, OpenLayersStore, TFunction) => SidebarSectionData[] = (
    user_interactions,
    state_proxy,
    taxonomy_store,
    store_actions,
    open_layers_store,
    t,
) => {
    const sections = [
        {
            title: 'Taxonomies and Classes',
            slug: 'taxonomies',
            content: (
                <Viewer
                    refresh_source_by_status={user_interactions.refresh_source_by_status}
                    state_proxy={state_proxy}
                    taxonomy_store={taxonomy_store}
                    user_interactions={user_interactions} />
            ),
        },
        {
            title: t('title:annotation_browser'),
            slug: 'annotation-browser',
            content: (
                <AnnotationBrowserContainer
                    user_interactions={user_interactions}
                    open_layers_store={open_layers_store}
                    state_proxy={state_proxy}
                    taxonomy_store={taxonomy_store}
                    store={new AnnotationBrowserStore(
                        GEOSERVER_URL,
                        ANNOTATION_NAMESPACE,
                        ANNOTATION_LAYER,
                        state_proxy,
                        taxonomy_store,
                    )} />
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
            content: (<SettingsContainer user={state_proxy.logged_user} user_interactions={user_interactions} />),
        });
    }
    return sections;
};

type Props = {
    state_proxy: GeoImageNetStore,
    store_actions: StoreActions,
    taxonomy_store: TaxonomyStore,
    user_interactions: UserInteractions,
    open_layers_store: OpenLayersStore,
    t: TFunction,
};
type State = {
    opened_panel_title: string,
};

class Sidebar extends React.Component<Props, State> {

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
        const sidebar_sections = make_sidebar_sections(
            this.props.user_interactions,
            this.props.state_proxy,
            this.props.taxonomy_store,
            this.props.store_actions,
            this.props.open_layers_store,
            this.props.t);
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

const translated_sidebar = withTranslation()(Sidebar);

export {translated_sidebar as Sidebar};
