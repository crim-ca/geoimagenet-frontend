// @flow strict

import { observer } from 'mobx-react';
import React from 'react';
import { Link, Paper, Typography } from '@material-ui/core';
import { compose } from 'react-apollo';
import type { TFunction } from 'react-i18next';
import { Selector } from '../Taxonomy/Selector';
import { Tree } from '../Taxonomy/Tree';
import { withTranslation } from '../../utils';
import { withTaxonomyStore } from '../../model/HOCs';
import type { UserInteractions } from '../../domain';
import type { GeoImageNetStore } from '../../model/GeoImageNetStore';
import type { TaxonomyStore } from '../../model/TaxonomyStore';

type Props = {
  userInteractions: UserInteractions,
  geoImageNetStore: GeoImageNetStore,
  taxonomyStore: TaxonomyStore,
  t: TFunction,
};

@observer
class TaxonomyPresentation extends React.Component<Props> {
  render() {
    const {
      geoImageNetStore,
      taxonomyStore,
      userInteractions,
      t,
    } = this.props;
    const taxonomyClass = taxonomyStore.flat_taxonomy_classes[geoImageNetStore.root_taxonomy_class_id];
    const classes = taxonomyClass ? [taxonomyClass] : [];
    return (
      <>
        <Typography variant="body1">{t('intro:taxonomy.par_1')}</Typography>
        <Typography variant="body1">{t('intro:taxonomy.par_2')}</Typography>
        <Link download href={`${GEOIMAGENET_API_URL}/taxonomy_classes`}>{t('intro:taxonomy.download')}</Link>
        <Paper style={{ marginTop: '12px' }}>
          <Selector
            userInteractions={userInteractions}
            geoImageNetStore={geoImageNetStore}
          />
          {classes.length > 0
            ? (
              <Tree
                geoImageNetStore={geoImageNetStore}
                userInteractions={userInteractions}
                taxonomy_classes={classes}
              />
            ) : null}
        </Paper>
      </>
    );
  }
}

const component = compose(
  withTranslation(),
  withTaxonomyStore,
)(TaxonomyPresentation);
export { component as TaxonomyPresentation };
