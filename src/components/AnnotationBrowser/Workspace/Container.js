// @flow strict

import React from 'react';
import { observer } from 'mobx-react';
import { Typography, Button } from '@material-ui/core';
import { TFunction } from 'i18next';

import { withTaxonomyStore } from '../../../model/HOCs';
import { LeafClassGroup } from './LeafClassGroup';

import type { TaxonomyStore } from '../../../model/store/TaxonomyStore';
import type { GeoImageNetStore } from '../../../model/store/GeoImageNetStore';
import type { UserInteractions } from '../../../domain';
import type { LeafClassGroup as leafClassGroupEntity } from '../../../Types';
import { compose } from 'react-apollo';
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
    const { t } = this.props;
    const { leaf_class_groups } = this.props.taxonomyStore;
    return (
      <>
        <Typography variant='h5'>{t('workspace:title')}</Typography>
        {leaf_class_groups.length === 0
          ? <p>{t('workspace:no_data')}</p>
          : <Button>{t('workspace:empty')}</Button>}
        {leaf_class_groups
          .sort((class_group_left: leafClassGroupEntity, class_group_right: leafClassGroupEntity) => {
            return class_group_left.path.localeCompare(class_group_right.path);
          })
          .map((class_group: leafClassGroupEntity, i) => {
            return (
              <LeafClassGroup key={i}
                              class_group={class_group}
                              geoImageNetStore={this.props.geoImageNetStore}
                              userInteractions={this.props.userInteractions} />
            );
          })}
      </>
    );
  }
}

const component = compose(
  withTaxonomyStore,
  withTranslation(),
)(Container);
export { component as Container };
