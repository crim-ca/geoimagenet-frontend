// @flow

import {observer} from "mobx-react";
import React, {Component} from "react";

type Props = {
    value: any,
    checked: boolean,
    change_handler: Function,
};

@observer
class Checkbox extends Component<Props> {

    render() {
        return (
            <label className='checkbox_eye'>
                <input type='checkbox'
                       value={this.props.value}
                       checked={this.props.checked}
                       onChange={this.props.change_handler} />
                <span />
            </label>
        );
    }
}

export {Checkbox};
