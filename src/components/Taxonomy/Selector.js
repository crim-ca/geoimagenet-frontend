// @flow strict

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import type { TFunction } from 'react-i18next';
import { UserInteractions } from '../../domain';
import { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import { withTranslation } from '../../utils';

type Props = {
  geoImageNetStore: GeoImageNetStore,
  userInteractions: UserInteractions,
  t: TFunction,
};
type State = {
  value: number,
};

@observer
class Selector extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      value: 0,
    };
  }

  /**
   * We use the positional id because the actual taxonomy id is hidden within the versions of the taxonomies, which is a bit more
   * of a hassle to use to select the right one than if it were flat.
   * It's probable that structure will change in the future, so basically selecting whatever taxonomy was built in the order
   * in which it was built if safer.
   * @param event
   * @param {number} taxonomyPositionalId the 0 indexed position of the taxonomy to be selected in the store's collection of taxonomies
   * @returns {Promise<void>}
   */
  handleTabSelect = async (event: Event, taxonomyPositionalId: number) => {
    this.setState({ value: taxonomyPositionalId });
    const { userInteractions: { select_taxonomy } } = this.props;
    const taxonomy = this.props.geoImageNetStore.taxonomies[taxonomyPositionalId];
    await select_taxonomy(taxonomy);
  };

  render() {
    // Building a tabs component without an actual value to pass in errors with material-ui.
    const { t, geoImageNetStore: { taxonomies } } = this.props;

    if (taxonomies.length === 0) {
      return <p>{t('intro:taxonomy.no_taxonomies')}</p>;
    }

    const { value } = this.state;
    return (
      <Tabs value={value} onChange={this.handleTabSelect}>
        {taxonomies.map((taxonomy, i) => (
          <Tab
            value={i}
            key={i}
            label={t(`taxonomy_classes:${taxonomy.versions[0].root_taxonomy_class_id}`)}
          />
        ))}
      </Tabs>
    );
  }
}

const component = withTranslation()(Selector);
export { component as Selector };
