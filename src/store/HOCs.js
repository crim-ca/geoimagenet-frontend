// @flow strict

import React from 'react';
import {taxonomy_store, annotation_browser_store} from './instance_cache';

type Props = {};
const withTaxonomyStore = (InnerComponent) => class extends React.Component<Props> {
    render() {
        return (
            <InnerComponent {...this.props} taxonomy_store={taxonomy_store} />
        );
    }
};
const withAnnotationBrowserStore = (InnerComponent) => class extends React.Component<Props> {
        render() {
        return (
            <InnerComponent {...this.props} annotation_browser_store={annotation_browser_store} />
        );
    }
};

export {
    withTaxonomyStore,
    withAnnotationBrowserStore,
};
