// @flow strict

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.values.gutterMedium,
  },
  paragraph: {
    marginBotton: theme.values.butterSmall,
  },
}));

export default function HowToContainer() {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant='h3' align='left'>
        How to use the Models section
      </Typography>
      <Typography variant='body1' align='left'>
        Placeholder text
      </Typography>
    </Container>
  );
}
