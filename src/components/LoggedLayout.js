import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import {Menu} from './Menu.js';
import {UserInteractions} from '../domain';

const LayoutGrid = withStyles(theme => {
    const {values} = theme;
    return {
        grid: {
            height: '100%',
            display: 'grid',
            gridTemplateColumns: `1fr`,
            gridTemplateRows: `${values.heightAppBar} calc(100% - ${values.heightAppBar})`
        },
    };
})(props => {
    const {classes, children} = props;
    return <div className={classes.grid}>{children}</div>;
});

const Bottom = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            gridRow: '2/3',
            gridColumn: '1/2',
        }
    };
})(props => {
    const {classes, children} = props;
    return <div className={classes.root}>{children}</div>;
});
const Top = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            gridRow: '1/2',
            gridColumn: '1/2',
        }
    };
})(props => {
    const {classes, children} = props;
    return <div className={classes.root}>{children}</div>;
});

/**
 * The LoggedLayout should be used for every top level page that is behind the login.
 * It will put a menu on top, and the children at the bottom.
 * Each bottom component is responsible for setting its bottom section's layout.
 */
class LoggedLayout extends Component {

    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
        children: PropTypes.any,
    };

    render() {
        const {children, state_proxy} = this.props;
        /**
         * Wrapping both menu and children in divs so that the grid is respected whatever the other structures are.
         */
        return (
            <LayoutGrid>
                <Top><Menu state_proxy={state_proxy} user_interactions={this.props.user_interactions} /></Top>
                <Bottom>{children}</Bottom>
            </LayoutGrid>
        );
    }
}

export {LoggedLayout};
