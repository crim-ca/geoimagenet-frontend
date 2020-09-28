// @flow strict
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

const Grid = withStyles(({ values }) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `${values.gutterSmall} 1fr minmax(300px, max-content) 1fr ${values.gutterSmall}`,
    gridTemplateRows: 'min-content',
  },
  content: {
    gridColumn: '1/4',
    display: 'grid',
    gridTemplateRows: 'min-content',
    gridGap: values.gutterSmall,
    marginTop: values.gutterSmall,
  },
}))(({ classes: { root, content }, children }) => (
  <div className={root}>
    <div className={content}>{children}</div>
  </div>
));

export default Grid;
