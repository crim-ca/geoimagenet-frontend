/* eslint-disable object-shorthand */
// @flow strict

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { ANNOTATION_THUMBNAIL_SIZE } from '../constants';

export const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn,
};

const GUTTER_SMALL = '12px';
const GUTTER_MEDIUM = '24px';

const turquoise_ish = 'rgba(0, 188, 213, 1)';

/**
 * We want to give a coherent look to all themed components.
 * This theme should be used everywhere so that changes affect all components.
 * @type {Theme}
 */
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: turquoise_ish,
    },
    secondary: {
      main: '#FFF',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Montserrat',
  },
  values: {
    annotation_size: `${ANNOTATION_THUMBNAIL_SIZE}px`,
    widthSidebar: '600px',
    heightAppBar: '40px',
    heightActionsBar: '40px',
    gutterSmall: GUTTER_SMALL,
    gutterMedium: GUTTER_MEDIUM,
    maxContentWidth: '1200px',
  },
  zIndex: {
    basemap: -10,
    over_map: 10,
  },
  colors: {
    icon_grey: 'rgba(113, 113, 113, 1)',
    turquoise: turquoise_ish,
    barelyWhite: 'rgba(255, 255, 255, 0.85)',
    gray: 'rgba(0, 0, 0, 0.5)',
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
      },
    },
    MuiPaper: {
      root: {
        padding: GUTTER_SMALL,
      },
    },
    MuiTypography: {
      body1: {
        margin: `${GUTTER_SMALL} 0`,
      },
    },
    MuiExpansionPanel: {
      root: {
        padding: 0,
        '&$expanded': {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export const ThemedComponent = (props: { children: {} }) => {
  const { children } = props;
  return (
    <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
  );
};
ThemedComponent.propTypes = {
  children: PropTypes.object,
};
