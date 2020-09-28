// @flow strict

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Container,
  Typography,
} from '@material-ui/core';
import Grid from './Grid';
import GridContainer from './GridContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.values.gutterMedium,
  },
  paragraph: {
    maxWidth: '66%',
  },
  list: {
    margin: theme.values.gutterSmall,
    maxWidth: '66%',
  },
  subtitle: {
    marginTop: theme.values.gutterMedium,
  },
}));


export default function HowToContainer() {
  const classes = useStyles();
  const helptext = {
    title: 'How to use the Models section',
    subtitle1: 'Packaging',
    paragraph1: 'In order to submit a new model to the platform, the steps are the following:',
    list1: [
      'The model must be trained using PyTorch and the parameters saved as a .pth',
      'Add the model code to the model repository (by creating a fork of the repo)',
      'The trained model must be packaged using the thelper framework.',
      'Two notebooks are available showing how to package a ResNet and a UNet.',
    ],
    subtitle2: 'Pushing Models',
    paragraph2: 'Once the model is packaged, it can be uploaded using the Model user interface'
      + 'on the platform using the Choose file button to select your model, and then upload it.',
  };

  const list = helptext.list1.map((l) => <li>{l}</li>);

  return (
    <Container className={classes.root}>
      <Typography variant='h3' align='left'>
        {helptext.title}
      </Typography>
      <Typography className={classes.subtitle} variant='h4' align='left'>
        {helptext.subtitle1}
      </Typography>
      <Typography className={classes.paragraph} variant='body1' align='left'>
        {helptext.paragraph1}
      </Typography>
      <Typography className={classes.list} variant='body1' align='left'>
        {list}
      </Typography>
      <Typography className={classes.subtitle} variant='h4' align='left'>
        {helptext.subtitle2}
      </Typography>
      <Typography className={classes.paragraph} variant='body1' align='left'>
        {helptext.paragraph2}
      </Typography>
      <Typography variant='h4' align='left'>
        Geoimagenet help links
      </Typography>
      <Grid>
        <GridContainer>
          <Button
            variant="contained"
            color="primary"
            target='_blank'
            href='https://github.com/crim-ca/geoimagenet'
          >
            <Typography variant="body2" color='secondary'>
              Example notebooks
            </Typography>
          </Button>
          <Button
            variant="contained"
            color="primary"
            target='_blank'
            href='https://crim-ca.github.io/geoimagenet/#managing-models'
          >
            <Typography variant="body2" color='secondary'>
              Documentation
            </Typography>
          </Button>
        </GridContainer>
      </Grid>
    </Container>
  );
}
