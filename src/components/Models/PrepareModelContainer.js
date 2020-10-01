// @flow strict

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Container,
  Typography,
} from '@material-ui/core';
import { ButtonGrid } from './ButtonGrid';

type Props = {
  model_upload_instructions_url: string,
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.values.gutterMedium,
    align: 'left',
  },
}));

export default function PrepareModelContainer(props: Props) {
  const { model_upload_instructions_url } = props;
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant='h4' align='left'>
        Thelper help links
      </Typography>
      <ButtonGrid>
        <Button variant="contained" color="primary" target='_blank' href={model_upload_instructions_url}>
          <Typography variant="body2" color='secondary'>
              How to prepare your model
          </Typography>
        </Button>
        <Button
          variant="contained"
          color="primary"
          target='_blank'
          href='https://thelper.readthedocs.io/'
        >
          <Typography variant="body2" color='secondary'>
              Documentation
          </Typography>
        </Button>
        <Button
          variant="contained"
          color="primary"
          target='_blank'
          href='https://github.com/plstcharles/thelper'
        >
          <Typography variant="body2" color='secondary'>
              Github Repository
          </Typography>
        </Button>
      </ButtonGrid>
    </Container>
  );
}
