import {observer} from 'mobx-react';
import {Component} from 'react';
import PropTypes from 'prop-types';
import {ANNOTATION} from '../../domain/constants.js';
import {Collapse, List, ListItem, Chip} from '@material-ui/core';
import React from 'react';
import {TaxonomyClasses} from '../TaxonomyBrowser.js';
import {withStyles} from '@material-ui/core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';

const StyledListItem = withStyles({
    focusVisible: {
        backgroundColor: 'inherit',
    },
})(ListItem);
const SpacedChip = withStyles({
    root: {
        marginLeft: '6px',
    },
})(Chip);

@observer
class ReleaseButton extends Component {
    static propTypes = {
        onclick: PropTypes.func.isRequired,
    };

    render() {
        return <FontAwesomeIcon onClick={this.props.onclick} icon={faPaperPlane} className='fa-lg release' />;
    }
}

@observer
class Checkbox extends Component {
    static propTypes = {
        value: PropTypes.any.isRequired,
        checked: PropTypes.bool.isRequired,
        change_handler: PropTypes.func.isRequired,
    };

    render() {
        return (
            <label className='checkbox_eye'>
                <input type='checkbox'
                       value={this.props.value}
                       checked={this.props.checked}
                       onChange={this.props.change_handler} />
                <span />
            </label>
        );
    }
}

@observer
class AnnotationsCount extends Component {
    static propTypes = {
        class: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    };

    render() {
        return <SpacedChip label={this.props.count}
                           className={this.props.class}
                           variant='outlined' />;
    }
}

@observer
class TaxonomyClassLabel extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
    };

    render() {
        return <span>{this.props.label}</span>;
    }
}

@observer
class TaxonomyClassActions extends Component {
    static propTypes = {
        taxonomy_class: PropTypes.object.isRequired,
        invert_taxonomy_class_visibility: PropTypes.func.isRequired,
        release_handler: PropTypes.func.isRequired,
    };

    make_change_handler(taxonomy_class) {
        return () => {
            this.props.invert_taxonomy_class_visibility(taxonomy_class);
        };
    }

    render() {
        return (
            <span className='actions'>
                <Checkbox value={this.props.taxonomy_class.id}
                          change_handler={this.make_change_handler(this.props.taxonomy_class)}
                          checked={this.props.taxonomy_class.visible} />
                <ReleaseButton onclick={this.props.release_handler} />
            </span>
        );
    }
}

@observer
class TaxonomyClassListElement extends Component {
    static propTypes = {
        toggle_taxonomy_class_tree_element: PropTypes.func.isRequired,
        invert_taxonomy_class_visibility: PropTypes.func.isRequired,
        elem: PropTypes.object.isRequired,
        counts: PropTypes.object.isRequired,
        user_interactions: PropTypes.object.isRequired,
        map_manager: PropTypes.object.isRequired,
        store_actions: PropTypes.object.isRequired,
        state_proxy: PropTypes.object.isRequired,
    };

    make_toggle_callback(id) {
        return () => {
            this.props.toggle_taxonomy_class_tree_element(id);
        };
    }

    make_release_handler(taxonomy_class) {
        return async (event) => {
            try {
                event.stopPropagation();
                await this.props.user_interactions.release_annotations(taxonomy_class.id);
                this.props.map_manager.refresh_source_by_status(ANNOTATION.STATUS.NEW);
                this.props.map_manager.refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
            } catch (e) {
                throw e;
            }
        };
    }

    make_select_taxonomy_class_for_annotation_handler(taxonomy_class) {
        return () => {
            this.props.store_actions.select_taxonomy_class(taxonomy_class['id']);
        };
    }

    render() {
        const this_taxonomy_class_counts = this.props.counts[this.props.elem.id];

        const label_click_callback = this.props.elem.children && this.props.elem.children.length > 0
            ? this.make_toggle_callback(this.props.elem.id)
            : this.make_select_taxonomy_class_for_annotation_handler(this.props.elem);

        return (
            <List>
                <StyledListItem className='taxonomy_class_list_element'
                                onClick={label_click_callback}
                                selected={this.props.state_proxy.selected_taxonomy_class_id === this.props.elem.id}
                                button>
                    <span>
                        <TaxonomyClassLabel label={this.props.elem.name} />
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
                    <TaxonomyClassActions taxonomy_class={this.props.elem}
                                          release_handler={this.make_release_handler(this.props.elem)}
                                          invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility} />
                </StyledListItem>
                {this.props.elem.children
                    ? (
                        <Collapse in={this.props.elem.opened}>
                            <TaxonomyClasses classes={this.props.elem.children}
                                             counts={this.props.counts}
                                             map_manager={this.props.map_manager}
                                             store_actions={this.props.store_actions}
                                             state_proxy={this.props.state_proxy}
                                             user_interactions={this.props.user_interactions}
                                             invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility}
                                             toggle_taxonomy_class_tree_element={this.props.toggle_taxonomy_class_tree_element} />
                        </Collapse>
                    )
                    : null
                }
            </List>
        );
    }
}

export {TaxonomyClassListElement};
