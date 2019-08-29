// @flow strict

import {observer} from "mobx-react";
import React, {Component} from "react";

type Props = {
    value: number,
    checked: boolean,
    change_handler: () => void,
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
