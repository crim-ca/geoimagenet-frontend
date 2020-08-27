// @flow strict

import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Button,
  Container,
  Typography,
} from '@material-ui/core';

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

const GridContainer = withStyles((theme) => ({
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
      <Typography variant='h3' align='left'>
        Thelper help section
      </Typography>
      <Grid>
        <GridContainer>
          <Button variant="contained" color="primary" target='_blank' href={model_upload_instructions_url}>
            <Typography variant="body2" color='secondary'>
              How to prepare your model
            </Typography>
          </Button>
          <Button variant="contained" color="primary" target='_blank' href='https://github.com/plstcharles/thelper'>
            <Typography variant="body2" color='secondary'>
              Github Repository
            </Typography>
          </Button>
          <Button variant="contained" color="primary" target='_blank' href='https://thelper.readthedocs.io/'>
            <Typography variant="body2" color='secondary'>
              Official Documentation
            </Typography>
          </Button>
        </GridContainer>
      </Grid>
    </Container>
  );
}
