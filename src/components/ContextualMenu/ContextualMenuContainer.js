// @flow strict

import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { debounced } from '../../utils/event_handling';
import type { ContextualMenuItem } from '../../Types';
import { ContextualMenuManager } from './ContextualMenuManager';
import { ACTION_EXIT_CONTEXTUAL_MENU } from './utils';

type PromiseResolutionCallback = (?string) => void;
type Props = {};
type State = {
  menu_items: ContextualMenuItem[],
  open: boolean,
  resolve: PromiseResolutionCallback,
  reject: PromiseResolutionCallback,
  mouse_x: number,
  mouse_y: number,
};

const defaultResolve: PromiseResolutionCallback = () => {
  throw new Error('The default resolve was called, this means the dialog container was probably not correctly instantiated.');
};
const defaultReject: PromiseResolutionCallback = () => {
  throw new Error('The default reject was called, this means the dialog container was probably not correctly instantiated.');
};

export const defaultState = {
  menu_items: [],
  open: false,
  resolve: defaultResolve,
  reject: defaultReject,
};

class ContextualMenuContainer extends React.Component<Props, State> {
  anchorElement: HTMLElement | null;

  constructor() {
    super();
    this.state = { ...defaultState };
    ContextualMenuManager.register_populate_menu_callback(this.handle_populate_menu_request);
  }

  componentDidMount(): void {
    if (this.anchorElement === null) {
      throw new TypeError('There should be an anchor element for the contextual menu container. '
        + 'It appears the DOM was not correctly constructed.');
    }
    /**
     * $FlowFixMe
     * We can't possibly know all the type of every handler we'll want to debounce
     * ignore flow validation here
     */
    window.addEventListener('mousemove', debounced(50, this.set_mouse_position));
  }

  /**
   * When destroying this component, we need to unregister our dialog creation callback from the manager.
   * That way, if a container reappears in the future, we'll still be able to create dialogs.
   */
  componentWillUnmount(): void {
    ContextualMenuManager.remove_populate_menu_callback();
  }

  setAnchorElement = (element: HTMLElement | null) => {
    this.anchorElement = element;
  };

  set_mouse_position = (event: MouseEvent) => {
    this.setState({
      mouse_x: event.clientX,
      mouse_y: event.clientY,
    });
  };

  handle_populate_menu_request = async (menu_items: ContextualMenuItem[], resolve: PromiseResolutionCallback, reject: PromiseResolutionCallback) => {
    this.setState({
      open: true,
      menu_items,
      resolve,
      reject,
    });
  };

  handle_outside_click = () => {
    const { reject } = this.state;
    reject(ACTION_EXIT_CONTEXTUAL_MENU);
    this.setState({ ...defaultState });
  };


  create_onclick_handler = (item: ContextualMenuItem) => () => {
    const { resolve } = this.state;
    resolve(item.value);
    this.setState({ ...defaultState });
  };

  render() {
    const {
      mouse_x,
      mouse_y,
      open,
      menu_items,
    } = this.state;
    return (
      <>
        <div
          ref={this.setAnchorElement}
          style={{
            position: 'absolute',
            left: `${mouse_x}px`,
            top: `${mouse_y}px`,
          }}
        />
        <Menu
          onClose={this.handle_outside_click}
          open={open}
          anchorEl={this.anchorElement}
        >
          {
            menu_items.map((item: ContextualMenuItem, i) => (
              <MenuItem key={`${item.value}_${i}`} onClick={this.create_onclick_handler(item)}>{item.text}</MenuItem>
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
