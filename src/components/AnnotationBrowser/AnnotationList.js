// @flow strict

import React from 'react';
import {observer} from 'mobx-react';
import type {Annotation} from "../../Types";

type Props = {
    annotations: Annotation[]
};

@observer
class AnnotationList extends React.Component<Props> {
    render() {
        return (
            <>
                {this.props.annotations.map((annotation, i) => (
                    <p key={i}>{annotation.id}</p>
                ))}
            </>
        );
    }
}

export {
    AnnotationList,
};
