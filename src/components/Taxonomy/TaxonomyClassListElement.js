// @flow

import {observer} from 'mobx-react';
import {Component} from 'react';
import PropTypes from 'prop-types';
import {Collapse, List, ListItem} from '@material-ui/core';
import React from 'react';
import {withStyles} from '@material-ui/core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';

import {AnnotationCounts} from './AnnotationCounts';

import {Classes} from './Classes';
import {ANNOTATION} from '../../domain/constants.js';
import {typeof TaxonomyClass} from "../../domain/entities";
import {typeof UserInteractions} from "../../domain";
import {typeof StoreActions} from "../../store";
import {typeof GeoImageNetStore} from "../../store/GeoImageNetStore";

const StyledListItem = withStyles({
    root: {
        padding: '4px',
        justifyContent: 'space-between',
    },
})(ListItem);
const StyledList = withStyles({
    padding: {
        paddingTop: 0,
        paddingBottom: 0,
    }
})(List);

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

const StyledLabelAndCountSpan = withStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    }
})(props => {
    const {classes, children} = props;
    return <span className={classes.root}>{children}</span>;
});

type Props = {
    toggle_taxonomy_class_tree_element: Function,
    invert_taxonomy_class_visibility: Function,
    refresh_source_by_status: Function,
    taxonomy_class: TaxonomyClass,
    user_interactions: UserInteractions,
    store_actions: StoreActions,
    state_proxy: GeoImageNetStore,
};

/**
 * The TaxonomyClassListElement element is an entry in the taxonomy classes list, as well as any children the class might have.
 * It should allow for toggling of visibility for its classes, as well as releasing new annotations that are currently pending for that class.
 */
@observer
class TaxonomyClassListElement extends Component<Props> {

    /**
     * Create the click handler with the relevant class entity
     * @private
     * @param {TaxonomyClass} taxonomy_class
     * @returns {Function<>}
     */
    make_toggle_callback = taxonomy_class => () => {
        this.props.user_interactions.toggle_taxonomy_class(taxonomy_class);
    };

    /**
     *
     * @private
     * @param {TaxonomyClass} taxonomy_class
     * @returns {Function<Event>}
     */
    make_release_handler = taxonomy_class => async event => {
        try {
            event.stopPropagation();
            await this.props.user_interactions.release_annotations(taxonomy_class.id);
            this.props.refresh_source_by_status(ANNOTATION.STATUS.NEW);
            this.props.refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
        } catch (e) {
            throw e;
        }
    };

    /**
     * @private
     * @param {TaxonomyClass} taxonomy_class
     * @returns {Function<>}
     */
    make_select_taxonomy_class_for_annotation_handler = taxonomy_class => () => {
        this.props.store_actions.select_taxonomy_class(taxonomy_class.id);
    };

    render() {

        const {taxonomy_class, state_proxy} = this.props;
        const {children} = taxonomy_class;

        const label_click_callback = children && children.length > 0
            ? this.make_toggle_callback(taxonomy_class)
            : this.make_select_taxonomy_class_for_annotation_handler(taxonomy_class);

        return (
            <StyledList>
                <StyledListItem className='taxonomy_class_list_element'
                                onClick={label_click_callback}
                                selected={this.props.state_proxy.selected_taxonomy_class_id === taxonomy_class.id}
                                button>
                    <StyledLabelAndCountSpan>
                        <TaxonomyClassLabel label={taxonomy_class.name_en} />
                        <AnnotationCounts name_en={taxonomy_class.name_en} counts={taxonomy_class.counts} state_proxy={state_proxy}/>
                    </StyledLabelAndCountSpan>
                    <TaxonomyClassActions taxonomy_class={taxonomy_class}
                                          release_handler={this.make_release_handler(taxonomy_class)}
                                          invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility} />
                </StyledListItem>
                {children
                    ? (
                        <Collapse in={taxonomy_class.opened}>
                            <Classes classes={children}
                                     store_actions={this.props.store_actions}
                                     state_proxy={this.props.state_proxy}
                                     user_interactions={this.props.user_interactions}
                                     refresh_source_by_status={this.props.refresh_source_by_status}
                                     invert_taxonomy_class_visibility={this.props.invert_taxonomy_class_visibility}
                                     toggle_taxonomy_class_tree_element={this.props.toggle_taxonomy_class_tree_element} />
                        </Collapse>)
                    : null
                }
            </StyledList>
        );
    }
}

export {TaxonomyClassListElement};
