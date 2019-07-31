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

/**
 * There should be a single <DialogContainer /> in the app. Processes that want to obtain confirmation must import the DialogManager
 * singleton and invoke the confirm('Do you really want?') method on it. Currently only supports an yes/no confirmation,
 * without customization on the actual button text nor multiple different resolutions.
 */
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

    /**
     * The callback meant to be passed to the DialogManager for when we want confirmation from the user.
     * It should not be called from the container itself.
     */
    handle_dialog_request = (text: string, handle_accept: Function, handle_refuse: Function) => {
        this.setState({
            open: true,
            text,
            handle_accept: this.handle_close_dialog(handle_accept),
            handle_refuse: this.handle_close_dialog(handle_refuse)
        });
    };

    /**
     * Decorates the promise resolution method: we need to close the dialog before resolving the promise.
     */
    handle_close_dialog = (promise_resolution_callback: Function) => async () => {
        const confirmation_message = this.state.text;
        await this.setState({
            open: false,
            text: '',
            handle_accept: null,
            handle_refuse: null,
        });
        promise_resolution_callback(confirmation_message);
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