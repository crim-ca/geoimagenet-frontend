import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {ACTIONS} from '../domain/constants.js';

@observer
class Actions extends Component {

    render() {

        return (
            <div className='actions'>
                {
                    this.props.actions_activated
                        ? ACTIONS.map((action, i) => (
                            <button key={i} onClick={() => {
                                this.props.store_actions.set_mode(action.mode);
                            }}>
                                <span className={
                                    action.mode === this.props.mode
                                        ? `fas ${action.icon_class} fa-2x active`
                                        : `fas ${action.icon_class} fa-2x`
                                }/>
                            </button>
                        ))
                        : ACTIONS.map((action, i) => (
                            <button key={i}>
                                <span className={
                                    action.mode === this.props.mode
                                        ? `fas ${action.icon_class} fa-2x active`
                                        : `fas ${action.icon_class} fa-2x inactive`
                                }/>
                            </button>
                        ))
                }
            </div>
        );
    }

}

export {Actions};
