// @flow

import React from 'react';
import {DialogManager} from "./DialogManager";
import {PromisifiedDialog} from './PromisifiedDialog';

type Props = {};
type State = {
    open: boolean,
    text: string,
    handle_accept: Function|null,
    handle_refuse: Function|null,
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

    handle_dialog_request(open: boolean, text: string, handle_accept: Function, handle_refuse: Function) {
        this.setState({open, text, handle_accept, handle_refuse});
    }

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