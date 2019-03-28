import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {Tabs, Tab} from '@material-ui/core';

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
    };

    state = {
        value: '',
    };

    handle_tab_select = async (event, value) => {

        const {select_taxonomy} = this.props.user_interactions;

        this.setState({value});
        const version = value['versions'][0];
        await select_taxonomy(version, value.name);
    };

    render() {

        const {value} = this.state;
        const {taxonomies} = this.props.state_proxy;

        return (
            <Tabs value={value} onChange={this.handle_tab_select}>
                { taxonomies.map((taxonomy, i) => <Tab value={taxonomy} key={i} label={taxonomy.name_en || taxonomy.name_fr} />) }
            </Tabs>
        );
    }
}

export {
    TaxonomyClasses,
    TaxonomySelector
};
