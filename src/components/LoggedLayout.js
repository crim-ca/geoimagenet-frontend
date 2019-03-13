import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import {Menu} from './Menu.js';

const styles = theme => ({
    grid: {
        height: '100%',
        display: 'grid',
        gridTemplateColumns: `1fr`,
        gridTemplateRows: `${theme.values.heightAppBar} calc(100% - ${theme.values.heightAppBar})`
    },
});

/**
 * The LoggedLayout should be used for every top level page that is behind the login.
 * It will put a menu on top, and the children at the bottom.
 * Each bottom component is responsible for setting its bottom section's layout.
 */
class LoggedLayout extends Component {

    static propTypes = {
        classes: PropTypes.object,
        children: PropTypes.any,
    };

    render() {
        const {classes, children} = this.props;
        /**
         * Wrapping both menu and children in divs so that the grid is respected whatever the other structures are.
         */
        return (
            <div className={classes.grid}>
                <div><Menu /></div>
                <div>{children}</div>
            </div>
        );
    }
}

export default withStyles(styles)(LoggedLayout);
