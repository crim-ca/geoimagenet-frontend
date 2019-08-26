// @flow strict

import {observer} from "mobx-react";
import React, {Component} from "react";
import {Collapse, List, ListItem, withStyles} from "@material-ui/core";
import {Tree} from "./Tree";
import {TaxonomyClassLabel} from './TaxonomyClassLabel';
import {TaxonomyClass} from "../../domain/entities";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {UserInteractions} from "../../domain";
import {TFunction} from "react-i18next";
import {AnnotationCounts} from "./AnnotationCounts";

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
    user_interactions: UserInteractions,
    t: TFunction,
};

@observer
class PresentationListElement extends Component<Props> {
    render() {
        const {taxonomy_class, state_proxy, user_interactions, t} = this.props;
        const {children} = taxonomy_class;
        const {toggle_taxonomy_class} = user_interactions;
        const make_toggle_callback = elem => () => {
            toggle_taxonomy_class(elem);
        };
        const label_click_callback = children && children.length > 0
            ? make_toggle_callback(taxonomy_class)
            : null;

        const label = t(`taxonomy_classes:${taxonomy_class.id}`);
        return (
            <StyledList>
                <StyledListItem className='taxonomy_class_list_element'
                                onClick={label_click_callback}
                                selected={state_proxy.selected_taxonomy_class_id === taxonomy_class.id}
                                button>
                    <StyledLabelAndCountSpan>
                        <TaxonomyClassLabel label={label}/>
                        <AnnotationCounts
                            name_en={taxonomy_class.name_en}
                            counts={taxonomy_class.counts}
                            annotation_status_list={state_proxy.annotation_status_list}/>
                    </StyledLabelAndCountSpan>
                </StyledListItem>
                {children
                    ? (
                        <Collapse in={taxonomy_class.opened}>
                            <Tree taxonomy_classes={children}
                                  state_proxy={state_proxy}
                                  user_interactions={user_interactions}
                                  t={t}/>
                        </Collapse>)
                    : null
                }
            </StyledList>
        );
    }
}

export {PresentationListElement};
