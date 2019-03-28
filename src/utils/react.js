import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const GUTTER_SMALL = '12px';

/**
 * We want to give a coherent look to all themed components.
 * This theme should be used everywhere so that changes affect all components.
 * @type {Theme}
 */
export const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: 'Montserrat'
    },
    values: {
        widthSidebar: '500px',
        heightAppBar: '64px',
        gutterSmall: GUTTER_SMALL,
        maxContentWidth: '1200px',
    },
    colors: {
        lightGray: 'rgba(0, 0, 0, 0.1)',
    },
    overrides: {
        MuiPaper: {
            root: {
                padding: GUTTER_SMALL,
            }
        },
        MuiLink: {
            root: {
                color: 'inherit',
            }
        },
    },
});

export const ThemedComponent = props => {
    const {children} = props;
    return (
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    );
};
ThemedComponent.propTypes = {
    children: PropTypes.object,
};
