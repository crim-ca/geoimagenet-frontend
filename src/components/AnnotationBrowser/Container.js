// @flow strict

import React from 'react';
import {observer} from 'mobx-react';

import {Paginator} from './Paginator';
import {AnnotationList} from './AnnotationList';
import {OpenLayersStore} from "../../store/OpenLayersStore";
import {Container as WorkspaceContainer} from './Workspace/Container';

import type {AnnotationBrowserStore} from "../../store/AnnotationBrowserStore";
import type {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {AnnotationStatus, BoundingBox} from "../../Types";
import type {TaxonomyStore} from "../../store/TaxonomyStore";
import type {UserInteractions} from "../../domain";

type Props = {
    store: AnnotationBrowserStore,
    state_proxy: GeoImageNetStore,
    user_interactions: UserInteractions,
    taxonomy_store: TaxonomyStore,
    open_layers_store: OpenLayersStore,
};

@observer
class Container extends React.Component<Props> {

    navigate = (bounding_box: BoundingBox, status: AnnotationStatus, annotation_id: number) => {
        this.props.open_layers_store.set_extent(bounding_box);
        /**
         * TODO ugly hack so that the feature is actually in the viewport when we try to select it
         *
         * The fit to extent method operates over 800 milliseconds, so 1000 here should be enough for it to finish
         */
        setTimeout(() => {
            const {annotations_collections} = this.props.state_proxy;
            const feature = annotations_collections[status].getArray().find(candidate => candidate.get('id') === annotation_id);
            if (feature === undefined) {
                return;
            }
            this.props.open_layers_store.select_feature(feature);
        }, 1200);
    };

    render() {
        return (
            <>
                <WorkspaceContainer user_interactions={this.props.user_interactions}
                                    state_proxy={this.props.state_proxy}
                                    taxonomy_store={this.props.taxonomy_store} />
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
