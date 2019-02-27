import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {MODE} from '../domain/constants.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faPlusSquare, faCopy, faEdit, faTrashAlt, faQuestionCircle, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ACTIONS = [
    {name: 'eye', icon: faEye, mode: MODE.VISUALIZE},
    {name: 'creation', icon: faPlusSquare, mode: MODE.CREATION},
    {name: 'duplicate', icon: faCopy, mode: MODE.DUPLICATE},
    {name: 'modify', icon: faEdit, mode: MODE.MODIFY},
    {name: 'delete', icon: faTrashAlt, mode: MODE.DELETE},
    {name: 'ask_expertise', icon: faQuestionCircle, mode: MODE.ASK_EXPERTISE},
    {name: 'validate', icon: faCheck, mode: MODE.VALIDATE},
    {name: 'refuse', icon: faTimes, mode: MODE.REJECT},
];

@observer
class Actions extends Component {
    static propTypes = {
        store_actions: PropTypes.object.isRequired,
        actions_activated: PropTypes.bool.isRequired,
        mode: PropTypes.string.isRequired,
    };

    make_set_mode_callback(mode) {
        return () => {
            this.props.store_actions.set_mode(mode);
        };
    }

    render() {

        return (
            <div className='actions'>
                {
                    this.props.actions_activated
                    ? ACTIONS.map((action, i) =>
                        <FontAwesomeIcon
                            key={i}
                            icon={action.icon}
                            className={ action.mode === this.props.mode ? 'fa-2x active' : 'fa-2x' }
                            onClick={this.make_set_mode_callback(action.mode)} />
                    )
                    : ACTIONS.map((action, i) =>
                        <FontAwesomeIcon
                            key={i}
                            icon={action.icon}
                            className={ action.mode === this.props.mode ? 'fa-2x active' : 'fa-2x inactive' } />
                    )
                }
            </div>
        );
    }

}

export {Actions};

/*
* <span className={
                                    action.mode === this.props.mode
                                        ? `fas ${action.icon_class} fa-2x active`
                                        : `fas ${action.icon_class} fa-2x`
                                }/>*/
