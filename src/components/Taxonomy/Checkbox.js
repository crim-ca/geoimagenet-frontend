// @flow strict

import {observer} from "mobx-react";
import React, {Component} from "react";

type Props = {
    value: number,
    checked: boolean,
    image_class: string,
    change_handler: () => void,
};

@observer
class Checkbox extends Component<Props> {

    render() {
        return (
            <label className={this.props.image_class}>
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
