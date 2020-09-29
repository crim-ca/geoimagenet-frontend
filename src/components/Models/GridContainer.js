// @flow strict
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export const GridContainer = withStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '40px',
    '& > *': {
      marginLeft: theme.values.gutterSmall,
      marginRight: theme.values.gutterSmall,
      marginTop: theme.values.gutterSmall,
    },
  },
}))(({ classes, children }) => (
  <div className={classes.root}>{children}</div>
));
