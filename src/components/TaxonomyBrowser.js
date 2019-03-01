import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {TaxonomyClassListElement} from './taxonomy/TaxonomyClassListElement.js';

@observer
class TaxonomyClasses extends Component {
    static propTypes = {
        toggle_taxonomy_class_tree_element: PropTypes.func.isRequired,
        invert_taxonomy_class_visibility: PropTypes.func.isRequired,
        classes: PropTypes.array.isRequired,
        counts: PropTypes.object.isRequired,
        user_interactions: PropTypes.object.isRequired,
        map_manager: PropTypes.object.isRequired,
        store_actions: PropTypes.object.isRequired,
        state_proxy: PropTypes.object.isRequired,
    };

    render() {
        return (
            <ul>
                {this.props.classes.map((elem, i) => (
                    <TaxonomyClassListElement key={i}
                                              elem={elem}
                                              counts={this.props.counts}
                                              map_manager={this.props.map_manager}
                                              store_actions={this.props.store_actions}
                                              state_proxy={this.props.state_proxy}
                                              user_interactions={this.props.user_interactions}
                                              invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility}
                                              toggle_taxonomy_class_tree_element={this.props.toggle_taxonomy_class_tree_element} />
                ))}
            </ul>
        );
    }
}


@observer
class TaxonomySelector extends Component {
    static propTypes = {
        select_taxonomy: PropTypes.func.isRequired,
        taxonomy: PropTypes.array.isRequired,
    };

    make_select_taxonomy_callback(version, name) {
        return async () => {
            await this.props.select_taxonomy(version, name);
        };
    }

    render() {
        return (
            <div id='taxonomy' className='taxonomy'>{
                this.props.taxonomy.map((tax, i) => {
                    const version = tax['versions'][0];
                    return (
                        <button onClick={this.make_select_taxonomy_callback(version, tax.name)}
                                key={i}>{tax.name}</button>
                    );
                })}
            </div>
        );
    }
}

export {
    TaxonomyClasses,
    TaxonomySelector
};
