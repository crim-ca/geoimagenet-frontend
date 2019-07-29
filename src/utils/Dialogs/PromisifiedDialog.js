// @flow

import React from 'react';
import {Button, Dialog, DialogActions, DialogContent} from "@material-ui/core";

type Props = {
    open: boolean,
    text: string,
    handle_accept: Function,
    handle_refuse: Function,
};

export class PromisifiedDialog extends React.Component<Props> {
    render() {
        const {open, text, handle_accept, handle_refuse} = this.props;
        return (
            <Dialog
                open={open}>
                <DialogContent>{text}</DialogContent>
                <DialogActions>
                    <Button onClick={handle_accept}>accept</Button>
                    <Button onClick={handle_refuse}>cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }
}
