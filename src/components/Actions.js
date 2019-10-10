// @flow strict
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {withStyles} from '@material-ui/core';
import {features} from '../../features';

import {ANNOTATIONS, MODE, READ, VALIDATIONS, WRITE} from '../domain/constants.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faEye,
    faPlusSquare,
    faCopy,
    faEdit,
    faTrashAlt,
    faQuestionCircle,
    faCheck,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import {StoreActions} from "../store/StoreActions";
import {GeoImageNetStore} from "../store/GeoImageNetStore";

const ACTIONS = [
    {name: 'eye', icon: faEye, mode: MODE.VISUALIZE, permission_name: READ, resource: ANNOTATIONS},
    {name: 'creation', icon: faPlusSquare, mode: MODE.CREATION, permission_name: WRITE, resource: ANNOTATIONS},
    {name: 'duplicate', icon: faCopy, mode: MODE.DUPLICATE, permission_name: WRITE, resource: ANNOTATIONS},
    {name: 'modify', icon: faEdit, mode: MODE.MODIFY, permission_name: WRITE, resource: ANNOTATIONS},
    {name: 'delete', icon: faTrashAlt, mode: MODE.DELETE, permission_name: WRITE, resource: ANNOTATIONS},
];
if (features.expertise !== false) {
    ACTIONS.push({name: 'ask_expertise', icon: faQuestionCircle, mode: MODE.ASK_EXPERTISE, permission_name: WRITE, resource: ANNOTATIONS});
}
ACTIONS.push({name: 'validate', icon: faCheck, mode: MODE.VALIDATE, permission_name: WRITE, resource: VALIDATIONS});
ACTIONS.push({name: 'refuse', icon: faTimes, mode: MODE.REJECT, permission_name: WRITE, resource: VALIDATIONS});

const ActionsContainer = withStyles(theme => {
    const {values} = theme;
    return {
        root: {
            height: values.heightActionsBar
        }
    };
})(props => {
    const {classes, children} = props;
    return <div className={`${classes.root} actions`}>{children}</div>;
});

type Props = {
    store_actions: StoreActions,
    state_proxy: GeoImageNetStore,
};

/**
 * This component renders the different buttons that represent the modes in which an user can do actions upon the annotations.
 * It should filter the actions based on the access control list.
 */

@observer
class Actions extends Component<Props> {

    /**
     * Create specific callback for a mode. Each button should have its own callback such as these.
     */
    make_set_mode_callback = (mode: $Values<typeof MODE>) => () => {
        this.props.store_actions.set_mode(mode);
    };

    render() {

        const visible_actions = ACTIONS.filter(action => {
            return this.props.state_proxy.acl.can(action.permission_name, action.resource);
        });

        return (
            <ActionsContainer>
                {
                    this.props.state_proxy.actions_activated
                        ? visible_actions.map((action, i) =>
                            <FontAwesomeIcon
                                key={i}
                                icon={action.icon}
                                className={action.mode === this.props.state_proxy.mode ? 'fa-2x active' : 'fa-2x'}
                                onClick={this.make_set_mode_callback(action.mode)} />)
                        : visible_actions.map((action, i) =>
                            <FontAwesomeIcon
                                key={i}
                                icon={action.icon}
                                className={action.mode === this.props.state_proxy.mode ? 'fa-2x active' : 'fa-2x inactive'} />)
                }
            </ActionsContainer>
        );
    }

}

export {Actions};
