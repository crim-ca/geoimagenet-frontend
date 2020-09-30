// @flow strict
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export const ButtonGrid = withStyles((theme) => ({
  root: {
    gridColumn: '1/4',
    display: 'grid',
    gridTemplateRows: 'min-content',
    gridGap: theme.values.gutterSmall,
    marginTop: theme.values.gutterSmall,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    height: '40px',
    '& > *': {
      marginLeft: theme.values.gutterSmall,
      marginRight: theme.values.gutterSmall,
      marginTop: theme.values.gutterSmall,
    },
  },
}))(({ classes: { root, content }, children }) => (
  <div className={root}>
    <div className={content}>{children}</div>
  </div>
));
