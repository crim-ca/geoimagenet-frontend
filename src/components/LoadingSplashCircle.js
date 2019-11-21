// @flow strict

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

type Props = {};

const Grid = withStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }
})(({ classes, children }) => <div className={classes.root}>{children}</div>);

export class LoadingSplashCircle extends React.Component<Props> {
  render() {
    return (
      <Grid><CircularProgress size={48} /></Grid>
    );
  }
}
