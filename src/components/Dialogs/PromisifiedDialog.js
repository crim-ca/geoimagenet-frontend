// @flow strict

import React from 'react'
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core'

type Props = {
  open: boolean,
  text: string,
  handle_accept: () => Promise<void>,
  handle_refuse: () => Promise<void>,
};

export class PromisifiedDialog extends React.Component<Props> {
  render() {
    return (
      <Dialog
        open={this.props.open}>
        <DialogContent>{this.props.text}</DialogContent>
        <DialogActions>
          <Button onClick={this.props.handle_accept}>accept</Button>
          <Button onClick={this.props.handle_refuse}>cancel</Button>
        </DialogActions>
      </Dialog>
    )
  }
}
