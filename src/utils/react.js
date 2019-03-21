import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

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
        gutterSmall: '12px',
        maxContentWidth: '1200px',
    },
    colors: {
        lightGray: 'rgba(0, 0, 0, 0.1)',
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
