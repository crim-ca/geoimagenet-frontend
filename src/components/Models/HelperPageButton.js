// @flow strict

// Taken and modified from https://material-ui.com/components/dialogs/#full-screen-dialogs

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Cancel from '@material-ui/icons/Cancel';
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
  Slide,
} from '@material-ui/core';
import PrepareModelContainer from './PrepareModelContainer';
import HowToContainer from './HowToContainer';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
  },
}));


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

type Props = {
  model_upload_instructions_url: string,
}

export default function HelperPageButton(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { model_upload_instructions_url } = props;

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        <Typography variant="body2" color='secondary'>
              Help section
        </Typography>
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <Cancel color='secondary' />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Help section
            </Typography>
          </Toolbar>
        </AppBar>
        <HowToContainer />
        <PrepareModelContainer model_upload_instructions_url={model_upload_instructions_url} />
      </Dialog>
    </div>
  );
}
