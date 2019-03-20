import {createMuiTheme} from '@material-ui/core';

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
    }
});
