// @flow strict
import React from 'react';
import { Selector } from './Selector';
import { Classes } from './Classes';
import { withTranslation } from '../../utils';
import { observer } from 'mobx-react';

import type { UserInteractions } from '../../domain';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import type { TFunction } from 'react-i18next';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';
import { compose } from 'react-apollo';
import { withTaxonomyStore } from '../../model/HOCs';

type Props = {
  t: TFunction,
  geoImageNetStore: GeoImageNetStore,
  userInteractions: UserInteractions,
  taxonomyStore: TaxonomyStore,
  refresh_source_by_status: (string) => void,
};

@observer
class Viewer extends React.Component<Props> {
  render() {
    const { t, geoImageNetStore, userInteractions, taxonomyStore } = this.props;
    if (geoImageNetStore.selected_taxonomy === null) {
      return null;
    }

    // TODO when versions are actually implemented in the system this will need to be reviewed
    const taxonomy_class = taxonomyStore.flat_taxonomy_classes[geoImageNetStore.root_taxonomy_class_id];
    const classes = taxonomy_class ? [taxonomy_class] : [];

    return (
      <React.Fragment>
        <Selector userInteractions={userInteractions}
                  t={t}
                  geoImageNetStore={geoImageNetStore} />
        <Classes userInteractions={userInteractions}
                 geoImageNetStore={geoImageNetStore}
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

export { component as Viewer };
