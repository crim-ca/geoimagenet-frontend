// @flow strict

import React from 'react';
import {AnnotationList} from './AnnotationList';
import {observer} from 'mobx-react';
import type {AnnotationBrowserStore} from "../../store/AnnotationBrowserStore";

type Props = {
    store: AnnotationBrowserStore,
};

@observer
class Container extends React.Component<Props> {

    render() {
        return(
            <>
                <AnnotationList annotations={this.props.store.current_page_content} />
            </>
        );
    }
}

export {
    Container,
};
