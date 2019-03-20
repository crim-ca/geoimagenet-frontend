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

@observer
class Platform extends Component {
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.instanceOf(StoreActions).isRequired,
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
        data_queries: PropTypes.instanceOf(DataQueries).isRequired
    };

    state = {
        expanded: null,
    };

    constructor(props) {
        super(props);
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

    handle_change = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    render() {

        const taxonomy_class = this.props.state_proxy.flat_taxonomy_classes[this.props.state_proxy.selected_taxonomy.root_taxonomy_class_id];
        const classes = taxonomy_class && taxonomy_class.children ? taxonomy_class.children : [];

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
