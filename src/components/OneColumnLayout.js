// @flow strict

import React from 'react';
import { withStyles } from '@material-ui/core';

export const OneColumnLayout = withStyles(({ values }) => ({
  grid: {
    display: 'grid',
    paddingTop: values.gutterMedium,
    gridTemplateColumns: `${values.gutterMedium} 1fr minmax(300px, max-content) 1fr ${values.gutterMedium}`,
  },
  children: {
    gridColumn: '3/4',
    display: 'grid',
    gridTemplateRows: 'min-content',
    gridGap: values.gutterSmall,
  },
}))(({ classes, children }) => (
  <div className={classes.grid}>
    <div className={classes.children}>{children}</div>
  </div>
));
