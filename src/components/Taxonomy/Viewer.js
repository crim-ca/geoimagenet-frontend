// @flow

import React from 'react';
import {Selector} from "./Selector";
import {Classes} from "./Classes";
import {withTranslation} from "../../utils";
import {UserInteractions} from "../../domain";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {StoreActions} from "../../store";
import {observer} from "mobx-react";

type Props = {
    t: Function,
    state_proxy: GeoImageNetStore,
    user_interactions: UserInteractions,
    store_actions: StoreActions,
    refresh_source_by_status: Function,
};

@observer
class Viewer extends React.Component<Props> {
    render() {

        const {t, state_proxy, user_interactions, store_actions} = this.props;

        if (state_proxy.selected_taxonomy === null) {
            return null;
        }

        // TODO when versions are actually implemented in the system this will need to be reviewed
        const taxonomy_class = state_proxy.flat_taxonomy_classes[state_proxy.selected_taxonomy.versions[0].root_taxonomy_class_id];
        const classes = taxonomy_class ? [taxonomy_class] : [];

        return (
            <React.Fragment>
                <Selector user_interactions={user_interactions}
                          t={t}
                          state_proxy={state_proxy} />

                <Classes user_interactions={user_interactions}
                         store_actions={store_actions}
                         state_proxy={state_proxy}
                         refresh_source_by_status={this.props.refresh_source_by_status}
                         invert_taxonomy_class_visibility={store_actions.invert_taxonomy_class_visibility}
                         toggle_taxonomy_class_tree_element={store_actions.toggle_taxonomy_class_tree_element}
                         classes={classes} />
            </React.Fragment>
        );
    }
}

const TranslatedViewer = withTranslation()(Viewer);

export {TranslatedViewer as Viewer};
