import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import {withStyles, Chip} from '@material-ui/core';

const FilterChip = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            marginBottom: values.gutterSmall,
        },
    };
})(Chip);

/**
 * The annotation status filters should be visible at all time in the viewport so that the user does not have to remember what they chose.
 * Ideally float them over the map somewhere under the coordinates, with an easy way to toggle the filters.
 */

@observer
class AnnotationStatusFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        const {visible_annotations_types} = this.props.state_proxy;

        return (
            <React.Fragment>
                {visible_annotations_types.map((type, i) => <FilterChip label={type} key={i} />)}
            </React.Fragment>
        );
    }
}

AnnotationStatusFilter.propTypes = {
    state_proxy: PropTypes.object.isRequired,
};

export {AnnotationStatusFilter};
