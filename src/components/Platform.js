import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Actions} from './Actions.js';
import {TaxonomyClasses, TaxonomySelector} from './TaxonomyBrowser.js';
import PropTypes from 'prop-types';
import {MapManager} from '../MapManager.js';
import {createMuiTheme, CssBaseline, MuiThemeProvider} from '@material-ui/core';
import {lightBlue, lightGreen} from '@material-ui/core/colors';

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

@observer
class Platform extends Component {
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.object.isRequired,
        user_interactions: PropTypes.object.isRequired,
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

    render() {

        const taxonomy_class = this.props.state_proxy.flat_taxonomy_classes[this.props.state_proxy.selected_taxonomy.root_taxonomy_class_id];
        const classes = taxonomy_class && taxonomy_class.children ? taxonomy_class.children : [];

        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <div className='platform'>
                    <div id="map" className="map">
                        <span id="coordinates" className="coordinates" />
                    </div>
                    <div className="right paper">
                        <Actions actions_activated={this.props.state_proxy.actions_activated}
                                 mode={this.props.state_proxy.mode}
                                 store_actions={this.props.store_actions} />
                        <section id='taxonomy' className="taxonomy opened">
                            <button className="section-handle">Taxonomies and Classes</button>
                            <TaxonomySelector select_taxonomy={this.props.user_interactions.select_taxonomy}
                                              taxonomy={this.props.state_proxy.taxonomy} />
                            <TaxonomyClasses map_manager={this.map_manager}
                                             user_interactions={this.props.user_interactions}
                                             store_actions={this.props.store_actions}
                                             state_proxy={this.props.state_proxy}
                                             invert_taxonomy_class_visibility={this.props.store_actions.invert_taxonomy_class_visibility}
                                             toggle_taxonomy_class_tree_element={this.props.store_actions.toggle_taxonomy_class_tree_element}
                                             classes={classes} />
                        </section>
                        <section className="layer-switcher closed">
                            <button className="section-handle">Basemaps, Images and Filters</button>
                            <div id="layer-switcher" className="layer-switcher-container" />
                        </section>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export {Platform};
