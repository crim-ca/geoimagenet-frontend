// @flow strict

import React from 'react';
import {observer} from 'mobx-react';

import {Paginator} from './Paginator';
import {AnnotationList} from './AnnotationList';

import type {AnnotationBrowserStore} from "../../store/AnnotationBrowserStore";
import type {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {BoundingBox} from "../../Types";
import {OpenLayersStore} from "../../store/OpenLayersStore";

type Props = {
    store: AnnotationBrowserStore,
    state_proxy: GeoImageNetStore,
    open_layers_store: OpenLayersStore,
};

@observer
class Container extends React.Component<Props> {

    navigate = (bounding_box: BoundingBox) => {
        this.props.open_layers_store.set_extent(bounding_box);
    };

    render() {
        return (
            <>
                <AnnotationList
                    fit_view_to_bounding_box={this.navigate}
                    annotations={this.props.store.current_page_content}
                    geoserver_url={GEOSERVER_URL}
                    state_proxy={this.props.state_proxy} />
                <Paginator annotation_browser_store={this.props.store} />
            </>
        );
    }
}

export {
    Container,
};
