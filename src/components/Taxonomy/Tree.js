// @flow strict

import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {PresentationListElement} from './PresentationListElement';
import type {UserInteractions} from '../../domain';
import type {TaxonomyClass} from "../../domain/entities";
import type {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {TaxonomyStore} from "../../store/TaxonomyStore";

/**
 * The taxonomy tree should allow the user to navigate in a taxonomy's classes
 * It should have a single dependency, the taxonomy classes in a hierarchical structure.
 * Optimally, it could also be used in a tree that would allow actions to be taken from the widgets
 */

type Props = {
    taxonomy_classes: TaxonomyClass[],
    state_proxy: GeoImageNetStore,
    taxonomy_store: TaxonomyStore,
    user_interactions: UserInteractions,
};

@observer
class Tree extends Component<Props> {
    render() {
        const {taxonomy_classes, taxonomy_store, state_proxy, user_interactions} = this.props;
        return (
            <ul>
                {taxonomy_classes.map((taxonomy_class, i) => (
                    <PresentationListElement key={i}
                                             taxonomy_class={taxonomy_class}
                                             state_proxy={state_proxy}
                                             taxonomy_store={taxonomy_store}
                                             selected={taxonomy_store.selected_taxonomy_class_id === taxonomy_class.id}
                                             user_interactions={user_interactions} />
                ))}
            </ul>
        );
    }
}

export {Tree};
