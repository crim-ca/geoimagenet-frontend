import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {
    withStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Paper
} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';

import {Actions} from './Actions.js';
import {TaxonomyClasses, TaxonomySelector} from './TaxonomyBrowser.js';
import {MapManager} from '../MapManager.js';
import {DataQueries} from '../domain/data-queries.js';
import {UserInteractions} from '../domain/user-interactions.js';
import {StoreActions} from '../store';
import {LayerSwitcher} from '../LayerSwitcher.js';
import {AnnotationStatusFilter} from './AnnotationStatusFilter.js';

const StyledPanelDetails = withStyles({
    root: {
        flexDirection: 'column'
    },
})(ExpansionPanelDetails);

const PlatformContainer = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            display: 'grid',
            height: '100%',
            gridTemplateColumns: `1fr min-content ${values.widthSidebar}`,
            gridTemplateRows: '64px calc(100% - 64px)'
        }
    };
})(props => {
    const {classes, children} = props;
    return <div className={classes.root}>{children}</div>;
});
const MapContainer = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            gridRow: '1/3',
            gridColumn: '1/3',
        }
    };
})(props => {
    const {classes} = props;
    return <div id='map' className={classes.root} />;
});
const Coordinates = withStyles(theme => {
    const {values, zIndex} = theme;
    return {
        root: {
            gridRow: '1/2',
            gridColumn: '2/3',
            zIndex: zIndex.over_map,
            padding: values.gutterSmall,
            margin: values.gutterSmall,
            width: '300px',
        }
    };
})(Paper);
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

const Sidebar = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            gridRow: '1/3',
            gridColumn: '3/4',
        }
    };
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

/**
 * The Platform is the top level component for the annotation platform. It is responsible for managing the map, hence
 * the map manager is instantiated from here, after the component is mounted. We need to wait for the map elements to exist
 * or there would be nothing to mount the map onto.
 */
@observer
class Platform extends Component {
    /**
     * @type {Object}
     * @property {Object} state_proxy
     * @property {StoreActions} store_actions
     * @property {UserInteractions} user_interactions
     * @property {DataQueries} data_queries
     */
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.instanceOf(StoreActions).isRequired,
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
        data_queries: PropTypes.instanceOf(DataQueries).isRequired
    };

    /**
     * @private
     * @type {Object}
     * @property {string|null} expanded Currently expanded tab identifier.
     */
    state = {
        expanded: null,
    };

    /**
     * Instantiates the map manager as an empty object so we can pass it to the children elements that need it. Rendering will
     * happen before componentDidMount, so we need to have a dummy value before the map manager is actually instantiated.
     * @param {Object} props Attributes passed to the component by React.
     */
    constructor(props) {
        super(props);
        /**
         * @private
         * @type {MapManager|Object}
         */
        this.map_manager = {};

        this.props.user_interactions.refresh_user_resources_permissions();
    }

    /**
     * Since we need DOM elements to exist to create Open Layers maps, we hook onto React's componentDidMount lifecycle
     * callback and create the map manager only when the dom is correctly created.
     */
    componentDidMount() {
        /**
         * The Layer Switcher is paramount to the map: it should allow easy access and toggling to the various displayed layers.
         * @private
         * @type {LayerSwitcher}
         */
        this.layer_switcher = new LayerSwitcher(
            {target: 'layer-switcher'},
            this.props.store_actions.toggle_annotation_status_visibility
        );

        this.map_manager = new MapManager(
            GEOSERVER_URL,
            ANNOTATION_NAMESPACE_URI,
            ANNOTATION_NAMESPACE,
            ANNOTATION_LAYER,
            'map',
            this.props.state_proxy,
            this.props.store_actions,
            this.props.data_queries,
            this.layer_switcher
        );
    }

    /**
     * use double arrow function to actually create the callback for each panel.
     * @param {string} panel
     * @returns {Function}
     */
    handle_change = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    render() {

        const taxonomy_class = this.props.state_proxy.flat_taxonomy_classes[this.props.state_proxy.selected_taxonomy.root_taxonomy_class_id];
        const classes = taxonomy_class ? [taxonomy_class] : [];
        const {expanded} = this.state;

        return (
            <PlatformContainer>
                <MapContainer />
                <Coordinates id='coordinates' />
                <ActiveFiltersBox>
                    <AnnotationStatusFilter store_actions={this.props.store_actions} state_proxy={this.props.state_proxy} />
                </ActiveFiltersBox>
                <Sidebar>
                    <Actions state_proxy={this.props.state_proxy}
                             store_actions={this.props.store_actions} />
                    <SidebarBottom>
                        <ExpansionPanel expanded={expanded === 'taxonomies'}
                                        onChange={this.handle_change('taxonomies')}>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                Taxonomies and Classes
                            </ExpansionPanelSummary>
                            <StyledPanelDetails>
                                <TaxonomySelector user_interactions={this.props.user_interactions}
                                                  state_proxy={this.props.state_proxy} />

                                <TaxonomyClasses map_manager={this.map_manager}
                                                 user_interactions={this.props.user_interactions}
                                                 store_actions={this.props.store_actions}
                                                 state_proxy={this.props.state_proxy}
                                                 invert_taxonomy_class_visibility={this.props.store_actions.invert_taxonomy_class_visibility}
                                                 toggle_taxonomy_class_tree_element={this.props.store_actions.toggle_taxonomy_class_tree_element}
                                                 classes={classes} />
                            </StyledPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={expanded === 'layers'}
                                        onChange={this.handle_change('layers')}>
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

export {Platform};
