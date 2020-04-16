// @flow strict

import React from 'react';
import { observer } from 'mobx-react';
import { Typography, Button } from '@material-ui/core';
import { TFunction } from 'i18next';

import { compose } from 'react-apollo';
import { withTaxonomyStore } from '../../../model/HOCs';
import { LeafClassGroup } from './LeafClassGroup';

import type { TaxonomyStore } from '../../../model/store/TaxonomyStore';
import type { GeoImageNetStore } from '../../../model/store/GeoImageNetStore';
import type { UserInteractions } from '../../../domain';
import type { LeafClassGroup as leafClassGroupEntity } from '../../../Types';
import { withTranslation } from '../../../utils';

type Props = {
  taxonomyStore: TaxonomyStore,
  geoImageNetStore: GeoImageNetStore,
  userInteractions: UserInteractions,
  t: TFunction
};

/**
 * The "workspace", for lack of a better word, is a list of the taxonomy classes that are pinned by the user
 * A user pins taxonomy classes they want to have quick access to, in a smaller view than the whole taxonomy at once
 *
 * An ideal data structure would be an array of leaf classes organized by parents
 */
@observer
class Container extends React.Component<Props> {
  render() {
    const {
      t,
      taxonomyStore,
      geoImageNetStore,
      userInteractions,
    } = this.props;
    const { leaf_class_groups } = taxonomyStore;
    return (
      <React.Fragment>
        <Typography variant='h5'>{t('workspace:title')}</Typography>
        {leaf_class_groups.length === 0
          ? <p>{t('workspace:no_data')}</p>
          : <Button>{t('workspace:empty')}</Button>}
        {leaf_class_groups
          .sort((class_group_left: leafClassGroupEntity, class_group_right: leafClassGroupEntity) => class_group_left.path.localeCompare(class_group_right.path))
          .map((class_group: leafClassGroupEntity, i) => (
            <LeafClassGroup
              key={i}
              class_group={class_group}
              geoImageNetStore={geoImageNetStore}
              userInteractions={userInteractions}
            />
          ))}
      </React.Fragment>
    );
  }
}

const component = compose(
  withTaxonomyStore,
  withTranslation(),
)(Container);
export { component as Container };
