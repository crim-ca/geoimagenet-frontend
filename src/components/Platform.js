import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {
    createMuiTheme,
    CssBaseline,
    MuiThemeProvider,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    withStyles,
    Paper
} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import {lightBlue, lightGreen} from '@material-ui/core/colors';

import {Actions} from './Actions.js';
import {TaxonomyClasses, TaxonomySelector} from './TaxonomyBrowser.js';
import {MapManager} from '../MapManager.js';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiList: {
            padding: {
                paddingTop: 0,
                paddingBottom: 0,
            },
        },
        MuiListItem: {
            root: {
                paddingTop: '6px',
                paddingBottom: '6px',
                justifyContent: 'space-between',
            },
        },
    },
    palette: {
        primary: lightGreen,
        secondary: lightBlue,
    }
});

const StyledPanelDetails = withStyles({
    root: {
        flexDirection: 'column'
    },
})(ExpansionPanelDetails);

@observer
class Platform extends Component {
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.object.isRequired,
        user_interactions: PropTypes.object.isRequired,
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
            this.props.store_actions
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

        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <div className='platform'>
                    <div id="map" className="map">
                        <span id="coordinates" className="coordinates" />
                    </div>
                    <Paper className="right">
                        <Actions actions_activated={this.props.state_proxy.actions_activated}
                                 mode={this.props.state_proxy.mode}
                                 store_actions={this.props.store_actions} />
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
                        <ExpansionPanel expanded={expanded === 'layers'} onChange={this.handle_change('layers')}>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                Basemaps, Images and Filters
                            </ExpansionPanelSummary>
                            <StyledPanelDetails>
                                <div id="layer-switcher" className="layer-switcher-container" />
                            </StyledPanelDetails>
                        </ExpansionPanel>
                    </Paper>
                </div>
            </MuiThemeProvider>
        );
    }
}

export {Platform};
