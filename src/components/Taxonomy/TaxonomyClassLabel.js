// @flow

import {observer} from "mobx-react";
import React, {Component} from "react";

type Props = {
    label: string,
};

@observer
class TaxonomyClassLabel extends Component<Props> {

    render() {
        return <span>{this.props.label}</span>;
    }
}

export {TaxonomyClassLabel};
