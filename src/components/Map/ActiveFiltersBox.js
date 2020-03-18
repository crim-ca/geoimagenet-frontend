// @flow strict

import { withStyles } from '@material-ui/core';
import React from 'react';

export const ActiveFiltersBox = withStyles((theme) => {
  const { values } = theme;
  return {
    root: {
      marginRight: values.gutterSmall,
      gridRow: '2/3',
      gridColumn: '2/3',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      '& > button:not(:first-child)': {
        marginTop: values.gutterSmall,
      },
    },
  };
})((props) => {
  const { classes, children } = props;
  return <div className={classes.root}>{children}</div>;
});
