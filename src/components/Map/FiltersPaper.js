// @flow strict

import React from 'react';
import {observer} from 'mobx-react';

import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";

const style = theme => {
    const {colors} = theme;
    return {
        root: {
            border: `3px solid ${colors.turquoise}`,
            margin: 0,
            padding: 0,
            '& ul': {
                padding: 0,
            },
            '& > ul:not(:first-child)': {
                borderTop: `3px solid ${colors.turquoise}`,
            },
            '& > ul > li': {
                cursor: 'pointer',
                padding: '0 6px 0 0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            },
            '& > ul > li:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                padding: '0 6px 0 0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            },
            '& input[type=checkbox]': {
                display: 'inline-block'
            }
        },
    };
};

type Props = {
    children: {},
    classes: {
        root: {},
    },
};

@observer
class FiltersPaper extends React.Component<Props> {
    render() {
        const {classes} = this.props;
        return (
            <Paper className={classes.root}>
                {this.props.children}
            </Paper>
        );
    }
}

const component = withStyles(style)(FiltersPaper);

export {
    component as FiltersPaper
};
