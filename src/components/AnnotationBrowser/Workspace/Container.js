// @flow strict

import React from 'react';
import {observer} from 'mobx-react';

import type {TaxonomyClass} from "../../../domain/entities";
import type {TaxonomyStore} from "../../../store/TaxonomyStore";

type Props = {
    taxonomy_store: TaxonomyStore,
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
                        <span key={i}>{taxonomy_class.name_en}</span>
                    );
                })}
            </>
        );
    }
}

export {Container};
