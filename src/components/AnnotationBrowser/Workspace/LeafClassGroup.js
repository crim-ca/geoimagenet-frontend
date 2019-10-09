// @flow strict

import React from 'react';
import {PlatformListElement} from "../../Taxonomy/PlatformListElement";
import type {LeafClassGroup as LeafClassGroupEntity} from '../../../Types';
import type {UserInteractions} from "../../../domain";
import type {GeoImageNetStore} from "../../../store/GeoImageNetStore";

type Props = {
    class_group: LeafClassGroupEntity,
    user_interactions: UserInteractions,
    state_proxy: GeoImageNetStore,
};

class LeafClassGroup extends React.Component<Props> {
    render() {
        const {class_group} = this.props;
        return (
            <div>
                <span>{class_group.path}</span>
                {class_group.children.map((taxonomy_class, j) => (
                    <PlatformListElement user_interactions={this.props.user_interactions}
                                         state_proxy={this.props.state_proxy}
                                         taxonomy_class={taxonomy_class}
                                         key={j} />
                ))}
            </div>
        );
    }
}

export {
    LeafClassGroup,
};
