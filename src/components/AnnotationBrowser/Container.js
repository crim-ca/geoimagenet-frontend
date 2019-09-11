// @flow strict

import React from 'react';
import {observer} from 'mobx-react';

import {Paginator} from './Paginator';
import {AnnotationList} from './AnnotationList';

import type {AnnotationBrowserStore} from "../../store/AnnotationBrowserStore";

type Props = {
    store: AnnotationBrowserStore,
};

@observer
class Container extends React.Component<Props> {

    render() {
        return (
            <>
                <AnnotationList annotations={this.props.store.current_page_content} />
                <Paginator annotation_browser_store={this.props.store} />
            </>
        );
    }
}

export {
    Container,
};
