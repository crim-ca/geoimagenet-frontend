// @flow strict

import {observer} from "mobx-react";
import React, {Component} from "react";
import {Collapse, List, ListItem, withStyles} from "@material-ui/core";
import {Tree} from "./Tree";
import {TaxonomyClassLabel} from './TaxonomyClassLabel';
import {TaxonomyClass} from "../../domain/entities";
import {AnnotationCounts} from "./AnnotationCounts";
import {withTranslation} from '../../utils';

import type {UserInteractions} from "../../domain";
import type {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {TaxonomyStore} from "../../store/TaxonomyStore";
import type {TFunction} from "react-i18next";

const StyledList = withStyles({
    padding: {
        paddingTop: 0,
        paddingBottom: 0,
    }
})(List);
const StyledListItem = withStyles({
    root: {
        padding: '4px',
        justifyContent: 'space-between',
    },
})(ListItem);
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
    state_proxy: GeoImageNetStore,
    taxonomy_store: TaxonomyStore,
    selected: boolean,
    user_interactions: UserInteractions,
    t: TFunction,
};

@observer
class PresentationListElement extends Component<Props> {
    render() {
        const {taxonomy_class, state_proxy, user_interactions, t, selected, taxonomy_store} = this.props;
        if (taxonomy_class === undefined) {
            return null;
        }
        const {children} = taxonomy_class;
        const make_toggle_callback = elem => () => {
            taxonomy_store.toggle_taxonomy_class_tree_element(elem);
        };
        const label_click_callback = children && children.length > 0
            ? make_toggle_callback(taxonomy_class)
            : null;

        const label = t(`taxonomy_classes:${taxonomy_class.id}`);
        return (
            <StyledList>
                <StyledListItem className='taxonomy_class_list_element'
                                onClick={label_click_callback}
                                selected={selected}
                                button>
                    <StyledLabelAndCountSpan>
                        <TaxonomyClassLabel label={label}/>
                        <AnnotationCounts
                            name_en={taxonomy_class.name_en}
                            counts={taxonomy_class.counts}
                            annotation_status_filters={state_proxy.annotation_status_filters}/>
                    </StyledLabelAndCountSpan>
                </StyledListItem>
                {children
                    ? (
                        <Collapse in={taxonomy_class.opened}>
                            <Tree taxonomy_classes={children}
                                  state_proxy={state_proxy}
                                  taxonomy_store={taxonomy_store}
                                  user_interactions={user_interactions}
                                  t={t}/>
                        </Collapse>)
                    : null
                }
            </StyledList>
        );
    }
}

const TranslatedPresentationListElement = withTranslation()(PresentationListElement);
export {TranslatedPresentationListElement as PresentationListElement};
