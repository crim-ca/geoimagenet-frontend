// @flow strict

import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {UserInteractions} from '../../domain';
import {TaxonomyClass} from "../../domain/entities";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {PresentationListElement} from './PresentationListElement';

/**
 * The taxonomy tree should allow the user to navigate in a taxonomy's classes
 * It should have a single dependency, the taxonomy classes in a hierarchical structure.
 * Optimally, it could also be used in a tree that would allow actions to be taken from the widgets
 */

type Props = {
    taxonomy_classes: TaxonomyClass[],
    state_proxy: GeoImageNetStore,
    user_interactions: UserInteractions,
};

@observer
class Tree extends Component<Props> {
    render() {
        const {taxonomy_classes, state_proxy, user_interactions} = this.props;
        return (
            <ul>
                {taxonomy_classes.map((taxonomy_class, i) => (
                    <PresentationListElement key={i}
                                             taxonomy_class={taxonomy_class}
                                             state_proxy={state_proxy}
                                             user_interactions={user_interactions} />
                ))}
            </ul>
        );
    }
}

export {Tree};
