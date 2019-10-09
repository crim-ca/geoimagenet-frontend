// @flow strict

import React from 'react';
import {observer} from 'mobx-react';

import {withTaxonomyStore} from "../../../store/HOCs";
import {LeafClassGroup} from './LeafClassGroup';

import type {TaxonomyStore} from "../../../store/TaxonomyStore";
import type {GeoImageNetStore} from "../../../store/GeoImageNetStore";
import type {UserInteractions} from "../../../domain";
import type {LeafClassGroup as leafClassGroupEntity} from "../../../Types";

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
                {this.props.taxonomy_store.leaf_class_groups.map((class_group: leafClassGroupEntity, i) => {
                    return (
                        <LeafClassGroup key={i}
                                        class_group={class_group}
                                        state_proxy={this.props.state_proxy}
                                        user_interactions={this.props.user_interactions} />
                    );
                })}
            </>
        );
    }
}

const component = withTaxonomyStore(Container);
export {component as Container};
