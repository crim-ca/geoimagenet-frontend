import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Actions} from './Actions.jsx';
import {TaxonomyClasses, TaxonomySelector} from './TaxonomyBrowser.js';
import PropTypes from 'prop-types';

@observer
class Platform extends Component {
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.object.isRequired,
        user_interactions: PropTypes.object.isRequired,
    };

    render() {
        return (
            <div className='platform'>
                <div id="map" className="map">
                    <span id="coordinates" className="coordinates"/>
                </div>
                <div className="right paper">
                    <Actions actions_activated={this.props.state_proxy.actions_activated}
                             mode={this.props.state_proxy.mode}
                             store_actions={this.props.store_actions} />
                    <section className="taxonomy opened">
                        <button className="section-handle">Taxonomies and Classes</button>
                        <TaxonomySelector select_taxonomy={this.props.user_interactions.select_taxonomy}
                                          taxonomy={this.props.state_proxy.taxonomy} />
                        <TaxonomyClasses counts={this.props.state_proxy.annotation_counts}
                                         toggle_taxonomy_class_tree_element={this.props.store_actions.toggle_taxonomy_class_tree_element}
                                         classes={this.props.state_proxy.selected_taxonomy.elements} />
                    </section>
                    <section className="layer-switcher closed">
                        <button className="section-handle">Basemaps, Images and Filters</button>
                        <div id="layer-switcher" className="layer-switcher-container"/>
                    </section>
                </div>
            </div>
        );
    }
}

export {Platform};
