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
import type {UserInteractions} from "../../domain";
import {withAnnotationBrowserStore} from "../../store/HOCs";
import {compose} from "react-apollo";
import withStyles from "@material-ui/core/styles/withStyles";

type Props = {
    annotation_browser_store: AnnotationBrowserStore,
    state_proxy: GeoImageNetStore,
    user_interactions: UserInteractions,
    open_layers_store: OpenLayersStore,
    classes: {
        root: {},
    },
};
const style = theme => ({
    root: {
        '& hr': {
            margin: `${theme.values.gutterMedium} -${theme.values.gutterMedium}`,
            borderTop: `1px solid ${theme.colors.turquoise}`,
            border: '0',
        },
    },
});

@observer
class Container extends React.Component<Props> {

    navigate = (bounding_box: BoundingBox, status: AnnotationStatus, annotation_id: number) => {
        this.props.open_layers_store.set_extent(bounding_box);
        /**
         * TODO ugly hack so that the feature is actually in the viewport when we try to select it
         *
         * The fit to extent method operates over 800 milliseconds, so 1200 here should be enough for it to finish when the transition is jerky
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
        const {annotation_browser_store: {page_number, total_pages, total_features, next_page, previous_page, current_page_content}} = this.props;
        return (
            <div className={this.props.classes.root}>
                <WorkspaceContainer user_interactions={this.props.user_interactions}
                                    state_proxy={this.props.state_proxy} />
                <hr />
                <AnnotationList
                    fit_view_to_bounding_box={this.navigate}
                    annotations={current_page_content}
                    geoserver_url={GEOSERVER_URL}
                    state_proxy={this.props.state_proxy} />
                <Paginator page_number={page_number}
                           total_pages={total_pages}
                           total_features={total_features}
                           previous_page={previous_page}
                           next_page={next_page} />
            </div>
        );
    }
}

const component = compose(
    withStyles(style),
    withAnnotationBrowserStore,
)(Container);

export {
    component as Container,
};
