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

    /**
     * @private
     * @type {{handle_accept: Function|null, handle_refuse: Function|null, text: string, open: boolean}}
     */
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

    /**
     * When destroying this component, we need to unregister our dialog creation callback from the manager.
     * That way, if a container reappears in the future, we'll still be able to create dialogs.
     */
    componentWillUnmount(): void {
        DialogManager.remove_dialog_creation_callback();
    }

    /**
     * The callback meant to be passed to the DialogManager for when we want confirmation from the user.
     * It should not be called from the container itself. We use the arrow function because we need to bind this method
     * to the class here.
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
     * @param promise_resolution_callback this handler decorates either resolve or reject promise resolution, send the one needed
     * @private
     */
    handle_close_dialog(promise_resolution_callback: Function<any>): Function {
        return async (): void => {
            const confirmation_message = this.state.text;
            await this.setState({
                open: false,
                text: '',
                handle_accept: null,
                handle_refuse: null,
            });
            promise_resolution_callback(confirmation_message);
        };
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