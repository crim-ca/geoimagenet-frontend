import React, {Component} from 'react';
import {observer} from 'mobx-react';
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
import PropTypes from 'prop-types';

const ACTIONS = [
    {name: 'eye', icon: faEye, mode: MODE.VISUALIZE, permission_name: READ, resource: ANNOTATIONS},
    {name: 'creation', icon: faPlusSquare, mode: MODE.CREATION, permission_name: WRITE, resource: ANNOTATIONS},
    {name: 'duplicate', icon: faCopy, mode: MODE.DUPLICATE, permission_name: WRITE, resource: ANNOTATIONS},
    {name: 'modify', icon: faEdit, mode: MODE.MODIFY, permission_name: WRITE, resource: ANNOTATIONS},
    {name: 'delete', icon: faTrashAlt, mode: MODE.DELETE, permission_name: WRITE, resource: ANNOTATIONS},
    {name: 'ask_expertise', icon: faQuestionCircle, mode: MODE.ASK_EXPERTISE, permission_name: WRITE, resource: ANNOTATIONS},
    {name: 'validate', icon: faCheck, mode: MODE.VALIDATE, permission_name: WRITE, resource: VALIDATIONS},
    {name: 'refuse', icon: faTimes, mode: MODE.REJECT, permission_name: WRITE, resource: VALIDATIONS},
];

/**
 * This component renders the different buttons that represent the modes in which an user can do actions upon the annotations.
 * It should filter the actions based on the access control list.
 */

@observer
class Actions extends Component {

    /**
     * @property {StoreActions} store_actions
     * @property {Object} state_proxy
     */

    static propTypes = {
        store_actions: PropTypes.object.isRequired,
        state_proxy: PropTypes.object.isRequired
    };

    /**
     * Create specific callback for a mode. Each button should have its own callback such as these.
     * @private
     * @param {MODE} mode
     * @returns {Function}
     */
    make_set_mode_callback = mode => () => {
        this.props.store_actions.set_mode(mode);
    };

    render() {

        const visible_actions = ACTIONS.filter(action => {
            return this.props.state_proxy.acl.can(action.permission_name, action.resource);
        });

        return (
            <div className='actions'>
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
            </div>
        );
    }

}

export {Actions};
