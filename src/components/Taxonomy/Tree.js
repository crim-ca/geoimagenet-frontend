import React, {Component} from 'react';
import {ANNOTATION} from '../../domain/constants';
import {Chip, Collapse, List, ListItem, Tooltip, withStyles} from '@material-ui/core';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {UserInteractions} from '../../domain';

/**
 * The taxonomy tree should allow the user to navigate in a taxonomy's classes
 * It should have a single dependency, the taxonomy classes in a hierarchical structure.
 * Optimally, it could also be used in a tree that would allow actions to be taken from the widgets
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

TaxonomyClassLabel.propTypes = {
    label: PropTypes.string,
};

function AnnotationsCount({class_name, count, tooltip}) {
    return (
        <Tooltip title={tooltip}>
            <SpacedChip label={count}
                        className={class_name}
                        variant='outlined'/>
        </Tooltip>
    );
}

AnnotationsCount.propTypes = {
    class_name: PropTypes.string,
    count: PropTypes.number,
    tooltip: PropTypes.string,
};

@observer
class ListElement extends Component {
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
                        {taxonomy_class.counts[ANNOTATION.STATUS.NEW]
                            ? <AnnotationsCount class_name='annotation_new'
                                                tooltip={t(
                                                    'taxonomy_viewer:tooltip.new',
                                                    {
                                                        count: taxonomy_class.counts[ANNOTATION.STATUS.NEW],
                                                        taxonomy_class: label,
                                                    }
                                                )}
                                                count={taxonomy_class.counts[ANNOTATION.STATUS.NEW]}/>
                            : null}
                        {taxonomy_class.counts[ANNOTATION.STATUS.RELEASED]
                            ? <AnnotationsCount class_name='annotation_released'
                                                tooltip={t(
                                                    'taxonomy_viewer:tooltip.released',
                                                    {
                                                        count: taxonomy_class.counts[ANNOTATION.STATUS.RELEASED],
                                                        taxonomy_class: label,
                                                    }
                                                )}
                                                count={taxonomy_class.counts[ANNOTATION.STATUS.RELEASED]}/>
                            : null}
                        {taxonomy_class.counts[ANNOTATION.STATUS.VALIDATED]
                            ? <AnnotationsCount class_name='annotation_validated'
                                                tooltip={t(
                                                    'taxonomy_viewer:tooltip.validated',
                                                    {
                                                        count: taxonomy_class.counts[ANNOTATION.STATUS.VALIDATED],
                                                        taxonomy_class: label,
                                                    }
                                                )}
                                                count={taxonomy_class.counts[ANNOTATION.STATUS.VALIDATED]}/>
                            : null}
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

ListElement.propTypes = {
    taxonomy_class: PropTypes.object.isRequired,
    state_proxy: PropTypes.object.isRequired,
    user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
    t: PropTypes.func.isRequired,
};


@observer
class Tree extends Component {
    render() {
        const {taxonomy_classes, state_proxy, user_interactions, t} = this.props;
        return (
            <ul>
                {taxonomy_classes.map((taxonomy_class, i) => (
                    <ListElement key={i}
                                 t={t}
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
    t: PropTypes.func.isRequired,
};

export {
    Tree,
};
