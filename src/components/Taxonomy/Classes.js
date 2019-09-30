// @flow strict
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {PlatformListElement} from './PlatformListElement.js';
import type {TaxonomyClass} from "../../domain/entities";
import type {UserInteractions} from "../../domain";
import type {StoreActions} from "../../store/StoreActions";
import type {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {TaxonomyClassToggleFunction} from "../../Types";
import type {TaxonomyStore} from "../../store/TaxonomyStore";

type Props = {
    toggle_taxonomy_class_tree_element: (number) => void,
    invert_taxonomy_class_visibility: TaxonomyClassToggleFunction,
    refresh_source_by_status: (string) => void,
    classes: TaxonomyClass[],
    user_interactions: UserInteractions,
    store_actions: StoreActions,
    taxonomy_store: TaxonomyStore,
    state_proxy: GeoImageNetStore,
};

@observer
class Classes extends Component<Props> {

    render() {
        return (
            <ul>
                {this.props.classes.map((taxonomy_class, i) => (
                    <PlatformListElement key={i}
                                         taxonomy_class={taxonomy_class}
                                         store_actions={this.props.store_actions}
                                         state_proxy={this.props.state_proxy}
                                         taxonomy_store={this.props.taxonomy_store}
                                         refresh_source_by_status={this.props.refresh_source_by_status}
                                         user_interactions={this.props.user_interactions}
                                         invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility}
                                         toggle_taxonomy_class_tree_element={this.props.toggle_taxonomy_class_tree_element} />
                ))}
            </ul>
        );
    }
}


export {Classes};
