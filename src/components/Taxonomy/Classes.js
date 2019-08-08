import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';

import {TaxonomyClassListElement} from './TaxonomyClassListElement.js';

@observer
class Classes extends Component {
    static propTypes = {
        toggle_taxonomy_class_tree_element: PropTypes.func.isRequired,
        invert_taxonomy_class_visibility: PropTypes.func.isRequired,
        classes: PropTypes.array.isRequired,
        user_interactions: PropTypes.object.isRequired,
        map_manager: PropTypes.object.isRequired,
        store_actions: PropTypes.object.isRequired,
        state_proxy: PropTypes.object.isRequired,
    };

    render() {
        return (
            <ul>
                {this.props.classes.map((taxonomy_class, i) => (
                    <TaxonomyClassListElement key={i}
                                              taxonomy_class={taxonomy_class}
                                              map_manager={this.props.map_manager}
                                              store_actions={this.props.store_actions}
                                              state_proxy={this.props.state_proxy}
                                              user_interactions={this.props.user_interactions}
                                              invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility}
                                              toggle_taxonomy_class_tree_element={this.props.toggle_taxonomy_class_tree_element}/>
                ))}
            </ul>
        );
    }
}




export {
    Classes,
};
