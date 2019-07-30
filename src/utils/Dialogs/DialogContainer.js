// @flow

import React from 'react';
import {DialogManager} from "./DialogManager";
import {PromisifiedDialog} from './PromisifiedDialog';

type Props = {};
type State = {
    open: boolean,
    text: string,
    handle_accept: Function | null,
    handle_refuse: Function | null,
};

export class DialogContainer extends React.Component<Props, State> {

    state = {
        open: false,
        text: '',
        handle_accept: null,
        handle_refuse: null,
    };

    constructor() {
        super();
        DialogManager.register_dialog_creation_callback(this.handle_dialog_request);
    }

    componentWillUnmount(): void {
        DialogManager.remove_dialog_creation_callback();
    }

    handle_dialog_request = (text: string, handle_accept: Function, handle_refuse: Function) => {
        this.setState({
            open: true,
            text,
            handle_accept: this.handle_close_dialog(handle_accept),
            handle_refuse: this.handle_close_dialog(handle_refuse)
        });
    };

    handle_close_dialog = (callback: Function) => async () => {
        await this.setState({
            open: false,
            text: '',
            handle_accept: null,
            handle_refuse: null,
        });
        callback();
    };

    render() {
        const {open, text, handle_accept, handle_refuse} = this.state;
        return (
            <PromisifiedDialog
                open={open}
                text={text}
                handle_accept={handle_accept}
                handle_refuse={handle_refuse} />

        );
    }
}