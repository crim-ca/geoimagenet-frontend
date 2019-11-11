// @flow strict

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { PresentationListElement } from './PresentationListElement';
import type { UserInteractions } from '../../domain';
import type { TaxonomyClass } from '../../domain/entities';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';
import { withTaxonomyStore } from '../../model/HOCs';

/**
 * The taxonomy tree should allow the user to navigate in a taxonomy's classes
 * It should have a single dependency, the taxonomy classes in a hierarchical structure.
 * Optimally, it could also be used in a tree that would allow actions to be taken from the widgets
 */

type Props = {|
  taxonomy_classes: TaxonomyClass[],
  geoImageNetStore: GeoImageNetStore,
  taxonomyStore: TaxonomyStore,
  userInteractions: UserInteractions,
|};

@observer
class Tree extends Component<Props> {
  render() {
    const {
      taxonomy_classes,
      taxonomyStore,
      geoImageNetStore,
      userInteractions,
    } = this.props;
    return (
      <ul>
        {taxonomy_classes.map((taxonomy_class, i) => (
          <PresentationListElement
            key={i}
            taxonomy_class={taxonomy_class}
            geoImageNetStore={geoImageNetStore}
            selected={taxonomyStore.selected_taxonomy_class_id === taxonomy_class.id}
            userInteractions={userInteractions} />
        ))}
      </ul>
    );
  }
}

const component = withTaxonomyStore(Tree);
export { component as Tree };
