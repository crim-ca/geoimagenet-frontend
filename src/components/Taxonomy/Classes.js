// @flow strict
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {PlatformListElement} from './PlatformListElement.js';
import type {TaxonomyClass} from "../../domain/entities";
import type {UserInteractions} from "../../domain";
import type {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {TaxonomyStore} from "../../store/TaxonomyStore";

type Props = {
    classes: TaxonomyClass[],
    user_interactions: UserInteractions,
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
                                         state_proxy={this.props.state_proxy}
                                         taxonomy_store={this.props.taxonomy_store}
                                         user_interactions={this.props.user_interactions} />
                ))}
            </ul>
        );
    }
}


export {Classes};
