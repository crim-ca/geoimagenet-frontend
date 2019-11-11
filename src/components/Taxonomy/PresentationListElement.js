// @flow strict

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Collapse, List, ListItem, withStyles } from '@material-ui/core';
import { Tree } from './Tree';
import { TaxonomyClass } from '../../domain/entities';
import { AnnotationCounts } from './AnnotationCounts';
import { withTranslation } from '../../utils';

import type { UserInteractions } from '../../domain';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';
import type { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';
import { withTaxonomyStore } from '../../model/HOCs';

const StyledList = withStyles({
  padding: {
    paddingTop: 0,
    paddingBottom: 0,
  }
})(List);
const StyledListItem = withStyles({
  root: {
    padding: '4px',
    justifyContent: 'space-between',
  },
})(ListItem);
const StyledLabelAndCountSpan = withStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  }
})(props => {
  const { classes, children } = props;
  return <span className={classes.root}>{children}</span>;
});

type Props = {
  taxonomy_class: TaxonomyClass,
  geoImageNetStore: GeoImageNetStore,
  taxonomyStore: TaxonomyStore,
  selected: boolean,
  userInteractions: UserInteractions,
  t: TFunction,
};

@observer
class PresentationListElement extends Component<Props> {
  render() {
    const { taxonomy_class, geoImageNetStore, userInteractions, t, selected, taxonomyStore } = this.props;
    if (taxonomy_class === undefined) {
      return null;
    }
    const { children } = taxonomy_class;
    const make_toggle_callback = elem => () => {
      taxonomyStore.toggle_taxonomy_class_tree_element(elem);
    };
    const label_click_callback = children && children.length > 0
      ? make_toggle_callback(taxonomy_class)
      : null;
    return (
      <StyledList>
        <StyledListItem className='taxonomy_class_list_element'
                        onClick={label_click_callback}
                        selected={selected}
                        button>
          <StyledLabelAndCountSpan>
            <span>{t(`taxonomy_classes:${taxonomy_class.id}`)}</span>
            <AnnotationCounts
              name_en={taxonomy_class.name_en}
              counts={taxonomy_class.counts}
              annotationStatusFilters={geoImageNetStore.annotationStatusFilters} />
          </StyledLabelAndCountSpan>
        </StyledListItem>
        {children
          ? (
            <Collapse in={taxonomy_class.opened}>
              <Tree taxonomy_classes={children}
                    geoImageNetStore={geoImageNetStore}
                    userInteractions={userInteractions}
                    t={t} />
            </Collapse>)
          : null
        }
      </StyledList>
    );
  }
}

const component = compose(
  withTranslation(),
  withTaxonomyStore,
)(PresentationListElement);
export { component as PresentationListElement };
