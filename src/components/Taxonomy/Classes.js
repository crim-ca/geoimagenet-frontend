// @flow
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {TaxonomyClassListElement} from './TaxonomyClassListElement.js';
import {typeof TaxonomyClass} from "../../domain/entities";
import {typeof UserInteractions} from "../../domain";
import {typeof StoreActions} from "../../store";
import {typeof GeoImageNetStore} from "../../store/GeoImageNetStore";

type Props = {
    toggle_taxonomy_class_tree_element: Function,
    invert_taxonomy_class_visibility: Function,
    refresh_source_by_status: Function,
    classes: Array<TaxonomyClass>,
    user_interactions: UserInteractions,
    store_actions: StoreActions,
    state_proxy: GeoImageNetStore,
};

@observer
class Classes extends Component<Props> {

    render() {
        return (
            <ul>
                {this.props.classes.map((taxonomy_class, i) => (
                    <TaxonomyClassListElement key={i}
                                              taxonomy_class={taxonomy_class}
                                              store_actions={this.props.store_actions}
                                              state_proxy={this.props.state_proxy}
                                              refresh_source_by_status={this.props.refresh_source_by_status}
                                              user_interactions={this.props.user_interactions}
                                              invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility}
                                              toggle_taxonomy_class_tree_element={this.props.toggle_taxonomy_class_tree_element} />
                ))}
            </ul>
        );
    }
}


export {
    Classes,
};
