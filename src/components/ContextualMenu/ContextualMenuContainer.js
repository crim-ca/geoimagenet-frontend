// @flow strict

import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import type {ContextualMenuItem} from '../../Types';
import {ContextualMenuManager} from './ContextualMenuManager';
import {ACTION_EXIT_CONTEXTUAL_MENU} from "./utils";
import {debounced} from "../../utils/event_handling";

type PromiseResolutionCallback = (?string) => void;
type Props = {};
type State = {
    menu_items: ContextualMenuItem[],
    anchor_element: HTMLElement,
    open: boolean,
    resolve: PromiseResolutionCallback,
    reject: PromiseResolutionCallback,
    mouse_x: number,
    mouse_y: number,
};

const default_resolve: PromiseResolutionCallback = () => {
    throw new Error('The default resolve was called, this means the dialog container was probably not correctly instantiated.');
};
const default_reject: PromiseResolutionCallback = () => {
    throw new Error('The default reject was called, this means the dialog container was probably not correctly instantiated.');
};

export const default_state = {
    menu_items: [],
    open: false,
    resolve: default_resolve,
    reject: default_reject,
};

class ContextualMenuContainer extends React.Component<Props, State> {

    state = Object.assign({}, default_state);

    constructor() {
        super();
        ContextualMenuManager.register_populate_menu_callback(this.handle_populate_menu_request);
    }

    componentDidMount(): void {
        const anchor_element = document.getElementById('anchor_element');
        if (anchor_element === null) {
            throw new TypeError('There should be an anchor element for the contextual menu container. ' +
                'It appears the DOM was not correctly constructed.');
        }
        this.setState({anchor_element: anchor_element});
        /**
         * $FlowFixMe
         * We can't possibly know all the type of every handler we'll want to debounce
         * ignore flow validation here
         */
        window.addEventListener('mousemove', debounced(50, this.set_mouse_position));
    }

    set_mouse_position = (event: MouseEvent) => {
        this.setState({
            mouse_x: event.clientX,
            mouse_y: event.clientY,
        });
    };

    /**
     * When destroying this component, we need to unregister our dialog creation callback from the manager.
     * That way, if a container reappears in the future, we'll still be able to create dialogs.
     */
    componentWillUnmount(): void {
        ContextualMenuManager.remove_populate_menu_callback();
    }

    handle_populate_menu_request = async (menu_items: ContextualMenuItem[], resolve, reject) => {
        this.setState({
            open: true,
            menu_items: menu_items,
            resolve: resolve,
            reject: reject,
        });
    };

    handle_outside_click = () => {
        this.state.reject(ACTION_EXIT_CONTEXTUAL_MENU);
        this.setState(Object.assign({}, default_state));
    };


    create_onclick_handler = (item: ContextualMenuItem) => () => {
        this.state.resolve(item.value);
        this.setState(Object.assign({}, default_state));
    };

    render() {
        return (
            <>
                <div
                    id='anchor_element'
                    style={{position: 'absolute', left: `${this.state.mouse_x}px`, top: `${this.state.mouse_y}px`}} />
                <Menu
                    onClose={this.handle_outside_click}
                    open={this.state.open}
                    anchorEl={this.state.anchor_element}>
                    {
                        this.state.menu_items.map((item, i) => (
                            <MenuItem key={i} onClick={this.create_onclick_handler(item)}>{item.text}</MenuItem>
                        ))
                    }
                </Menu>
            </>
        );
    }
}

export {
    ContextualMenuContainer,
};
