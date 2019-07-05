import React, {Component} from 'react';
import {ANNOTATION} from '../../domain/constants';
import {Chip, Collapse, List, ListItem, Tooltip, withStyles} from '@material-ui/core';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {UserInteractions} from '../../domain';

/*
The taxonomy tree should allow the user to navigate in a taxonomy's classes
It should have a single dependency, the taxonomy classes in a hierarchical structure.
Optimally, it could also be used in a tree that would allow actions to be taken from the widgets
 */

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
const SpacedChip = withStyles({
    root: {
        marginLeft: '6px',
    },
})(Chip);

function TaxonomyClassLabel({label}) {
    return <span>{label}</span>;
}

function AnnotationsCount({class_name, count, tooltip}) {
    return (
        <Tooltip title={`${count} ${tooltip}`}>
            <SpacedChip label={count}
                        className={class_name}
                        variant='outlined'/>
        </Tooltip>
    );
}

@observer
class ListElement extends Component {
    render() {
        const {taxonomy_class, state_proxy, user_interactions} = this.props;
        const {children} = taxonomy_class;
        const {toggle_taxonomy_class} = user_interactions;
        const make_toggle_callback = elem => () => {
            toggle_taxonomy_class(elem);
        };
        const label_click_callback = children && children.length > 0
            ? make_toggle_callback(taxonomy_class)
            : null;

        return (
            <StyledList>
                <StyledListItem className='taxonomy_class_list_element'
                                onClick={label_click_callback}
                                selected={state_proxy.selected_taxonomy_class_id === taxonomy_class.id}
                                button>
                    <StyledLabelAndCountSpan>
                        <TaxonomyClassLabel label={taxonomy_class.name_en}/>
                        {taxonomy_class.counts[ANNOTATION.STATUS.NEW]
                            ? <AnnotationsCount class_name='annotation_new'
                                                tooltip={`new annotations of class ${taxonomy_class.name_en}`}
                                                count={taxonomy_class.counts[ANNOTATION.STATUS.NEW]}/>
                            : null}
                        {taxonomy_class.counts[ANNOTATION.STATUS.RELEASED]
                            ? <AnnotationsCount class_name='annotation_released'
                                                tooltip={`released annotations of class ${taxonomy_class.name_en}`}
                                                count={taxonomy_class.counts[ANNOTATION.STATUS.RELEASED]}/>
                            : null}
                        {taxonomy_class.counts[ANNOTATION.STATUS.VALIDATED]
                            ? <AnnotationsCount class_name='annotation_validated'
                                                tooltip={`validated annotations of class ${taxonomy_class.name_en}`}
                                                count={taxonomy_class.counts[ANNOTATION.STATUS.VALIDATED]}/>
                            : null}
                    </StyledLabelAndCountSpan>
                </StyledListItem>
                {children
                    ? (
                        <Collapse in={taxonomy_class.opened}>
                            <Tree taxonomy_classes={children}
                                  state_proxy={state_proxy}
                                  user_interactions={user_interactions}/>
                        </Collapse>)
                    : null
                }
            </StyledList>
        );
    }
}
ListElement.propTypes = {
    taxonomy_class: PropTypes.object.isRequired,
    state_proxy: PropTypes.object.isRequired,
    user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
};


@observer
class Tree extends Component {
    render() {
        const {taxonomy_classes, state_proxy, user_interactions} = this.props;
        return (
            <ul>
                {taxonomy_classes.map((taxonomy_class, i) => (
                    <ListElement key={i}
                                 taxonomy_class={taxonomy_class}
                                 state_proxy={state_proxy}
                                 user_interactions={user_interactions}/>
                ))}
            </ul>
        );
    }
}

Tree.propTypes = {
    taxonomy_classes: PropTypes.array.isRequired,
    state_proxy: PropTypes.object.isRequired,
    user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
};

export {
    Tree,
};
