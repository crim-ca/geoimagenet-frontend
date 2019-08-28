// @flow strict

import React from 'react';
import {Menu, MenuItem} from '@material-ui/core';
import type {ContextualMenuItem} from '../../Types';
import {ContextualMenuManager} from './ContextualMenuManager';


type Props = {};
type State = {
    menu_items: ContextualMenuItem[],
    anchor_element: HTMLElement | null,
    handle_resolve: () => Promise<void>,
    handle_reject: () => Promise<void>,
};

const default_handle_accept = () => {
    throw new Error('The default handle resolve was called, this means the dialog container was probably not correctly instantiated.');
};
const default_handle_refuse = () => {
    throw new Error('The default handle reject was called, this means the dialog container was probably not correctly instantiated.');
};

export const default_state = {
    menu_items: [],
    anchor_element: null,
    handle_resolve: default_handle_accept,
    handle_reject: default_handle_refuse,
};

export class ContextualMenuContainer extends React.Component<Props, State> {

    state = Object.assign({}, default_state);

    constructor() {
        super();
        ContextualMenuManager.register_populate_menu_callback(this.handle_populate_menu_request);
    }

    /**
     * When destroying this component, we need to unregister our dialog creation callback from the manager.
     * That way, if a container reappears in the future, we'll still be able to create dialogs.
     */
    componentWillUnmount(): void {
        ContextualMenuManager.remove_populate_menu_callback();
    }

    handle_populate_menu_request = async (menu_items: ContextualMenuItem[], anchor_element: HTMLElement, resolve, reject) => {
        this.setState({
            anchor_element: anchor_element,
            menu_items: menu_items,
            handle_resolve: resolve,
            handle_reject: reject,
        });
    };


    create_onclick_handler = (item: ContextualMenuItem) => () => {
        this.state.handle_resolve(item.value);
        this.setState(Object.assign({}, default_state));
    };

    render() {
        return (
            <Menu open={Boolean(this.state.anchor_element)} anchorEl={this.state.anchor_element}>
                {
                    this.state.menu_items.map((item, i) => (
                        <MenuItem key={i} onClick={this.create_onclick_handler(item)}>{item.text}</MenuItem>
                    ))
                }
            </Menu>
        );
    }
}
