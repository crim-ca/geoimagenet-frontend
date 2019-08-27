import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {withStyles, Chip} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import {StoreActions} from '../store/StoreActions';

const make_colored_filter_chip = color => {
    return withStyles(theme => {
        const {values, zIndex, colors} = theme;
        return {
            root: {
                marginBottom: values.gutterSmall,
                zIndex: zIndex.over_map,
            },
            colorPrimary: {
                backgroundColor: colors[color],
            },
            colorSecondary: {
                backgroundColor: colors[color],
                opacity: '0.1',
                '&:hover': {
                    opacity: '1',
                }
            },
            label: {
                textShadow: '1px 1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000',
            },
        };
    })(Chip);
};

const NormalChip = withStyles(theme => {
    const {values, zIndex} = theme;
    return {
        root: {
            marginBottom: values.gutterSmall,
            zIndex: zIndex.over_map,
        },
        label: {
            textShadow: '1px 1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000',
        },
    };
})(Chip);

/**
 * The annotation status filters should be visible at all time in the viewport so that the user does not have to remember what they chose.
 * Ideally float them over the map somewhere under the coordinates, with an easy way to toggle the filters.
 */

@observer
class AnnotationStatusFilter extends Component {

    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.instanceOf(StoreActions).isRequired,
    };

    toggle = annotation_type => () => {
        this.props.store_actions.toggle_annotation_status_visibility(annotation_type);
    };

    render() {
        const {annotation_status_list, show_labels} = this.props.state_proxy;
        const {toggle_show_labels} = this.props.store_actions;
        return (
            <React.Fragment>
                {show_labels
                    ? <NormalChip
                        color='primary'
                        label='Show class labels'
                        onDelete={toggle_show_labels} />
                    : <NormalChip
                        color='secondary'
                        label='Show class labels'
                        onDelete={toggle_show_labels}
                        deleteIcon={<DoneIcon />} />
                }
                {Object.keys(annotation_status_list).map((key, i) => {
                    const type = annotation_status_list[key];
                    const ColoredChip = make_colored_filter_chip(type.text);
                    return type.activated
                        ? <ColoredChip
                            label={type.text}
                            color='primary'
                            onDelete={this.toggle(type.text)}
                            key={i} />
                        : <ColoredChip
                            label={type.text}
                            color='secondary'
                            onDelete={this.toggle(type.text)}
                            deleteIcon={<DoneIcon />}
                            key={i} />;
                })}
            </React.Fragment>
        );
    }
}

export {AnnotationStatusFilter};
