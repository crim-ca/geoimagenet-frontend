// @flow strict

import {observer} from 'mobx-react';
import {Component} from 'react';
import {Collapse, List, ListItem} from '@material-ui/core';
import React from 'react';
import {withStyles} from '@material-ui/core';

import {AnnotationCounts} from './AnnotationCounts';
import {TaxonomyClassLabel} from './TaxonomyClassLabel';
import {TaxonomyClassActions} from './TaxonomyClassActions';

import {Classes} from './Classes';
import {ANNOTATION} from '../../domain/constants.js';

import type {TaxonomyClass} from "../../domain/entities";
import type {UserInteractions} from "../../domain";
import type {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {TaxonomyStore} from "../../store/TaxonomyStore";
import {withTaxonomyStore} from "../../store/HOCs";

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
    taxonomy_class: TaxonomyClass,
    user_interactions: UserInteractions,
    taxonomy_store: TaxonomyStore,
    state_proxy: GeoImageNetStore,
};

/**
 * The PlatformListElement element is an entry in the taxonomy classes list, as well as any children the class might have.
 * It should allow for toggling of visibility for its classes, as well as releasing new annotations that are currently pending for that class.
 */
@observer
class PlatformListElement extends Component<Props> {

    /**
     * Create the click handler with the relevant class entity
     */
    make_toggle_callback = (taxonomy_class: TaxonomyClass) => () => {
        this.props.taxonomy_store.toggle_taxonomy_class_tree_element(taxonomy_class);
    };

    make_release_handler = (taxonomy_class: TaxonomyClass) => async (event: Event) => {
        try {
            event.stopPropagation();
            await this.props.user_interactions.release_annotations(taxonomy_class.id);
            this.props.user_interactions.refresh_source_by_status(ANNOTATION.STATUS.NEW);
            this.props.user_interactions.refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
        } catch (e) {
            throw e;
        }
    };

    make_select_taxonomy_class_for_annotation_handler = (taxonomy_class: TaxonomyClass) => () => {
        this.props.taxonomy_store.select_taxonomy_class(taxonomy_class);
    };

    render() {

        const {taxonomy_class, state_proxy, taxonomy_store} = this.props;
        const {children} = taxonomy_class;

        const label_click_callback = children && children.length > 0
            ? this.make_toggle_callback(taxonomy_class)
            : this.make_select_taxonomy_class_for_annotation_handler(taxonomy_class);

        return (
            <StyledList>
                <StyledListItem className='taxonomy_class_list_element'
                                onClick={label_click_callback}
                                selected={this.props.taxonomy_store.selected_taxonomy_class_id === taxonomy_class.id}
                                button>
                    <StyledLabelAndCountSpan>
                        <TaxonomyClassLabel label={taxonomy_class.name_en} />
                        <AnnotationCounts
                            name_en={taxonomy_class.name_en}
                            counts={taxonomy_class.counts}
                            annotation_status_filters={state_proxy.annotation_status_filters}/>
                    </StyledLabelAndCountSpan>
                    <TaxonomyClassActions taxonomy_class={taxonomy_class}
                                          release_handler={this.make_release_handler(taxonomy_class)}
                                          toggle_pinned_class={this.props.taxonomy_store.toggle_pinned_class}
                                          invert_taxonomy_class_visibility={taxonomy_store.invert_taxonomy_class_visibility} />
                </StyledListItem>
                {children
                    ? (
                        <Collapse in={taxonomy_class.opened}>
                            <Classes taxonomy_classes={children}
                                     state_proxy={this.props.state_proxy}
                                     user_interactions={this.props.user_interactions} />
                        </Collapse>)
                    : null
                }
            </StyledList>
        );
    }
}

const component = withTaxonomyStore(PlatformListElement);

export {component as PlatformListElement};
