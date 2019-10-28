// @flow strict
import React from 'react';
import {Selector} from "./Selector";
import {Classes} from "./Classes";
import {withTranslation} from "../../utils";
import {observer} from "mobx-react";

import type {UserInteractions} from "../../domain";
import type {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {TFunction} from "react-i18next";
import type {TaxonomyStore} from "../../store/TaxonomyStore";
import {compose} from "react-apollo";
import {withTaxonomyStore} from "../../store/HOCs";

type Props = {
    t: TFunction,
    state_proxy: GeoImageNetStore,
    user_interactions: UserInteractions,
    taxonomy_store: TaxonomyStore,
    refresh_source_by_status: (string) => void,
};

@observer
class Viewer extends React.Component<Props> {
    render() {
        const {t, state_proxy, user_interactions, taxonomy_store} = this.props;
        if (state_proxy.selected_taxonomy === null) {
            return null;
        }

        // TODO when versions are actually implemented in the system this will need to be reviewed
        const taxonomy_class = taxonomy_store.flat_taxonomy_classes[state_proxy.root_taxonomy_class_id];
        const classes = taxonomy_class ? [taxonomy_class] : [];

        return (
            <React.Fragment>
                <Selector user_interactions={user_interactions}
                          t={t}
                          state_proxy={state_proxy} />
                <Classes user_interactions={user_interactions}
                         state_proxy={state_proxy}
                         refresh_source_by_status={this.props.refresh_source_by_status}
                         taxonomy_classes={classes} />
            </React.Fragment>
        );
    }
}

const component = compose(
    withTranslation(),
    withTaxonomyStore,
)(Viewer);

export {component as Viewer};
