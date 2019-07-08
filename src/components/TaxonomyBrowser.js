import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {Tabs, Tab, CircularProgress} from '@material-ui/core';

import {TaxonomyClassListElement} from './taxonomy/TaxonomyClassListElement.js';
import {UserInteractions} from '../domain/user-interactions.js';

@observer
class TaxonomyClasses extends Component {
    static propTypes = {
        toggle_taxonomy_class_tree_element: PropTypes.func.isRequired,
        invert_taxonomy_class_visibility: PropTypes.func.isRequired,
        classes: PropTypes.array.isRequired,
        user_interactions: PropTypes.object.isRequired,
        map_manager: PropTypes.object.isRequired,
        store_actions: PropTypes.object.isRequired,
        state_proxy: PropTypes.object.isRequired,
    };

    render() {
        return (
            <ul>
                {this.props.classes.map((taxonomy_class, i) => (
                    <TaxonomyClassListElement key={i}
                                              taxonomy_class={taxonomy_class}
                                              map_manager={this.props.map_manager}
                                              store_actions={this.props.store_actions}
                                              state_proxy={this.props.state_proxy}
                                              user_interactions={this.props.user_interactions}
                                              invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility}
                                              toggle_taxonomy_class_tree_element={this.props.toggle_taxonomy_class_tree_element} />
                ))}
            </ul>
        );
    }
}


@observer
class TaxonomySelector extends Component {
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
        t: PropTypes.func.isRequired,
    };

    state = {
        value: 0,
    };


    /**
     * We use the positional id because the actual taxonomy id is hidden within the versions of the taxonomies, which is a bit more
     * of a hassle to use to select the right one than if it were flat.
     * It's probable that structure will change in the future, so basically selecting whatever taxonomy was built in the order
     * in which it was built if safer.
     * @param event
     * @param {number} taxonomy_positional_id the 0 indexed position of the taxonomy to be selected in the store's collection of taxonomies
     * @returns {Promise<void>}
     */
    handle_tab_select = async (event, taxonomy_positional_id) => {
        this.setState({value: taxonomy_positional_id});

        const {select_taxonomy} = this.props.user_interactions;
        const value = this.props.state_proxy.taxonomies[taxonomy_positional_id];

        const version = value['versions'][0];
        await select_taxonomy(version, value.name);
    };

    render() {

        // Building a tabs component without an actual value to pass in errors with material-ui.
        const {taxonomies} = this.props.state_proxy;
        if (taxonomies.length === 0) {
            return <CircularProgress />;
        }

        const {value} = this.state;
        const {t} = this.props;
        return (
            <Tabs value={value} onChange={this.handle_tab_select}>
                { taxonomies.map((taxonomy, i) => <Tab value={i} key={i} label={t(`taxonomy_classes:${taxonomy.versions[0].root_taxonomy_class_id}`)} />) }
            </Tabs>
        );
    }
}

export {
    TaxonomyClasses,
    TaxonomySelector
};
