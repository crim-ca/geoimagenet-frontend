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
        heightActionsBar: '64px',
        gutterSmall: GUTTER_SMALL,
        maxContentWidth: '1200px',
    },
    zIndex: {
        basemap: -10,
        over_map: 10,
    },
    colors: {
        lightGray: 'rgba(0, 0, 0, 0.1)',
        new: 'rgba(0, 0, 0, 0.1)',
        pre_released: 'rgba(146, 209, 139, 0.9)',
        released: 'rgba(95, 175, 87, 0.9)',
        review: 'rgba(26, 104, 17, 0.9)',
        validated: 'rgba(7, 70, 0, 0.6)',
        rejected: 'rgb(121, 16, 8)',
        deleted: 'rgba(0, 0, 0, 0.9)',
    },
    overrides: {
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
