// @flow strict

import React from 'react';
import {observer} from 'mobx-react';
import {TaxonomyClass} from "../../../domain/entities";

type Props = {
    pinned_classes: TaxonomyClass[],
};
/**
 * The "workspace", for lack of a better word, is a list of the taxonomy classes that are pinned by the user
 * A user pins taxonomy classes they want to have quick access to, in a smaller view than the whole taxonomy at once
 */
@observer
class Container extends React.Component<Props> {
    render() {
        return (
            <>
                {this.props.pinned_classes.map((taxonomy_class: TaxonomyClass, i) => {
                    return (
                        <span key={i}>{taxonomy_class.name_en}</span>
                    );
                })}
            </>
        );
    }
}

export {Container};
