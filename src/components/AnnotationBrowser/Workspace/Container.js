// @flow strict

import React from 'react';
import {observer} from 'mobx-react';

import {PlatformListElement} from '../../Taxonomy/PlatformListElement';

import type {TaxonomyClass} from "../../../domain/entities";
import type {TaxonomyStore} from "../../../store/TaxonomyStore";
import type {GeoImageNetStore} from "../../../store/GeoImageNetStore";
import type {UserInteractions} from "../../../domain";

type Props = {
    taxonomy_store: TaxonomyStore,
    state_proxy: GeoImageNetStore,
    user_interactions: UserInteractions,
};
/**
 * The "workspace", for lack of a better word, is a list of the taxonomy classes that are pinned by the user
 * A user pins taxonomy classes they want to have quick access to, in a smaller view than the whole taxonomy at once
 *
 * An ideal data structure would be an array of leaf classes organized by parents
 */
@observer
class Container extends React.Component<Props> {
    render() {
        return (
            <>
                {this.props.taxonomy_store.leaf_pinned_classes.map((taxonomy_class: TaxonomyClass, i) => {
                    return (
                        <PlatformListElement user_interactions={this.props.user_interactions}
                                             state_proxy={this.props.state_proxy}
                                             taxonomy_class={taxonomy_class}
                                             taxonomy_store={this.props.taxonomy_store}
                                             key={i} />
                    );
                })}
            </>
        );
    }
}

export {Container};
