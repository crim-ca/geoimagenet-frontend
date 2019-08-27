// @flow strict

import {observer} from "mobx-react";
import React from "react";
import {Link, Paper, Typography} from "@material-ui/core";
import {Selector} from "../Taxonomy/Selector";
import {Tree} from "../Taxonomy/Tree";
import {withTranslation} from "../../utils";
import {UserInteractions} from "../../domain";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {TFunction} from "react-i18next";

type Props = {
    user_interactions: UserInteractions,
    state_proxy: GeoImageNetStore,
    t: TFunction,
};

@observer
class Taxonomy extends React.Component<Props> {
    render() {
        const {state_proxy, user_interactions, t} = this.props;
        const taxonomy_class = state_proxy.flat_taxonomy_classes[state_proxy.root_taxonomy_class_id];
        const classes = taxonomy_class ? [taxonomy_class] : [];
        return (
            <React.Fragment>
                <Typography variant='body1'>{t('intro:taxonomy.par_1')}</Typography>
                <Typography variant='body1'>{t('intro:taxonomy.par_2')}</Typography>
                <Link download href={`${GEOIMAGENET_API_URL}/taxonomy_classes`}>{t('intro:taxonomy.download')}</Link>
                <Paper style={{marginTop: '12px'}}>
                    <Selector user_interactions={user_interactions}
                              t={t}
                              state_proxy={state_proxy} />
                    {classes.length > 0
                        ? <Tree
                            t={t}
                            state_proxy={state_proxy}
                            user_interactions={user_interactions}
                            taxonomy_classes={classes} />
                        : null}
                </Paper>
            </React.Fragment>
        );
    }
}

export const TaxonomyPresentation = withTranslation()(Taxonomy);
