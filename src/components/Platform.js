import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    withStyles,
    Paper
} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';

import {Actions} from './Actions.js';
import {TaxonomyClasses, TaxonomySelector} from './TaxonomyBrowser.js';
import {MapManager} from '../MapManager.js';
import {DataQueries} from '../domain/data-queries.js';
import {UserInteractions} from '../domain/user-interactions.js';
import {StoreActions} from '../domain/store.js';

const StyledPanelDetails = withStyles({
    root: {
        flexDirection: 'column'
    },
})(ExpansionPanelDetails);

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
    }

    componentDidMount() {
        this.map_manager = new MapManager(
            GEOSERVER_URL,
            ANNOTATION_NAMESPACE_URI,
            ANNOTATION_NAMESPACE,
            ANNOTATION_LAYER,
            'map',
            this.props.state_proxy,
            this.props.store_actions,
            this.props.data_queries
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

        const values = {
            widthSidebar: '500px',
            heightAppBar: '64px',
        };

        const style = {
            platform: {
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
            },
            map: {
                height: '100%',
                width: `calc(100% - ${values.widthSidebar})`,
                position: 'relative',
            },
            sidebar: {
                width: values.widthSidebar,
            },
        };

        return (
            <div style={style.platform}>
                <div style={style.map} id='map' className='map'>
                    <span id='coordinates' className='coordinates' />
                </div>
                <Paper style={style.sidebar} className='right'>
                    <div className='top'>
                        <Actions actions_activated={this.props.state_proxy.actions_activated}
                                 mode={this.props.state_proxy.mode}
                                 store_actions={this.props.store_actions} />
                    </div>
                    <div className='bottom'>
                        <ExpansionPanel expanded={expanded === 'taxonomies'}
                                        onChange={this.handle_change('taxonomies')}>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                Taxonomies and Classes
                            </ExpansionPanelSummary>
                            <StyledPanelDetails>
                                <TaxonomySelector select_taxonomy={this.props.user_interactions.select_taxonomy}
                                                  taxonomy={this.props.state_proxy.taxonomy} />

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

                    </div>
                </Paper>
            </div>
        );
    }
}

export {Platform};
