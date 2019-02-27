import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {ANNOTATION} from '../domain/constants.js';
import Chip from '@material-ui/core/es/Chip/Chip.js';

const Checkbox = observer(({value, checked}) =>
    <label className='checkbox_eye'>
        <input type='checkbox' value={value} checked={checked} />
        <span />
    </label>
);
const ReleaseButton = observer(({onclick}) =>
    <button onClick={onclick}>
        <span className='fas fa-paper-plane fa-lg release' />
    </button>
);

const styles = {
    chip: {
        marginLeft: '6px',
    }
};

@observer
class AnnotationsCount extends Component {
    static propTypes = {
        class: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    };

    render() {
        return <Chip label={this.props.count}
                     className={this.props.class}
                     style={styles.chip}
                     variant='outlined' />;
    }
}


@observer
class TaxonomyClassListElement extends Component {
    static propTypes = {
        toggle_taxonomy_class_tree_element: PropTypes.func.isRequired,
        elem: PropTypes.object.isRequired,
        counts: PropTypes.object.isRequired,
    };

    make_toggle_callback(id) {
        return () => {
            this.props.toggle_taxonomy_class_tree_element(id);
        };
    }

    render() {
        const this_taxonomy_class_counts = this.props.counts[this.props.elem.id];
        return (
            <li className={this.props.elem.opened ? null : 'collapsed'}>
                <span className='taxonomy_class_list_element'>
                    <span>
                        <span onClick={this.make_toggle_callback(this.props.elem.id)}>{this.props.elem.name}</span>
                        {this_taxonomy_class_counts[ANNOTATION.STATUS.NEW]
                            ? <AnnotationsCount class='annotation_new'
                                                count={this_taxonomy_class_counts[ANNOTATION.STATUS.NEW]} />
                            : null}
                        {this_taxonomy_class_counts[ANNOTATION.STATUS.RELEASED]
                            ? <AnnotationsCount class='annotation_released'
                                                count={this_taxonomy_class_counts[ANNOTATION.STATUS.RELEASED]} />
                            : null}
                        {this_taxonomy_class_counts[ANNOTATION.STATUS.VALIDATED]
                            ? <AnnotationsCount class='annotation_validated'
                                                count={this_taxonomy_class_counts[ANNOTATION.STATUS.VALIDATED]} />
                            : null}
                    </span>
                </span>
                {this.props.elem.children
                    ? <TaxonomyClasses classes={this.props.elem.children}
                                       counts={this.props.counts}
                                       toggle_taxonomy_class_tree_element={this.props.toggle_taxonomy_class_tree_element} />
                    : null
                }
            </li>
        );
    }
}

@observer
class TaxonomyClasses extends Component {
    static propTypes = {
        toggle_taxonomy_class_tree_element: PropTypes.func.isRequired,
        classes: PropTypes.array.isRequired,
        counts: PropTypes.object.isRequired,
    };

    render() {
        return (
            <ul>
                {this.props.classes.map((elem, i) => (
                    <TaxonomyClassListElement key={i}
                                              elem={elem}
                                              counts={this.props.counts}
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
