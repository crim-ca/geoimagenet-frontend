// @flow strict
import { observer } from 'mobx-react';
import React from 'react';
import {
  Collapse,
  List,
  ListItem,
  withStyles,
} from '@material-ui/core';
import type { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';
import { TaxonomyClass } from '../../model/TaxonomyClass';
import { AnnotationCounts } from './AnnotationCounts';
import { withTranslation } from '../../utils';
import type { UserInteractions } from '../../domain';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';
import { Tree } from './Tree';
import { withTaxonomyStore, withUserInterfaceStore } from '../../model/HOCs';
import type { UserInterfaceStore } from '../../model/store/UserInterfaceStore';

const StyledList = withStyles({
  padding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
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
  },
})((props) => {
  const { classes, children } = props;
  return <span className={classes.root}>{children}</span>;
});

type Props = {
  taxonomy_class: TaxonomyClass,
  geoImageNetStore: GeoImageNetStore,
  taxonomyStore: TaxonomyStore,
  selected: boolean,
  userInteractions: UserInteractions,
  uiStore: UserInterfaceStore,
  t: TFunction,
};

@observer
class PresentationListElement extends React.Component<Props> {
  toggleListElementCallback = (elem) => () => {
    const { taxonomyStore, taxonomy_class: { children } } = this.props;
    if (children && children.length > 0) {
      taxonomyStore.toggle_taxonomy_class_tree_element(elem);
    }
  };

  render() {
    const {
      taxonomy_class,
      geoImageNetStore,
      userInteractions,
      t,
      selected,
      uiStore,
    } = this.props;
    if (taxonomy_class === undefined) {
      return null;
    }
    const { children } = taxonomy_class;
    return (
      <StyledList>
        <StyledListItem
          className="taxonomy_class_list_element"
          onClick={this.toggleListElementCallback(taxonomy_class)}
          selected={selected}
          button
        >
          <StyledLabelAndCountSpan>
            <span>{t(`taxonomy_classes:${taxonomy_class.id}`)}</span>
            <AnnotationCounts
              name_en={taxonomy_class.name_en}
              counts={taxonomy_class.counts}
              annotationStatusFilters={uiStore.annotationStatusFilters}
            />
          </StyledLabelAndCountSpan>
        </StyledListItem>
        {children
          ? (
            <Collapse in={taxonomy_class.opened}>
              <Tree
                taxonomy_classes={children}
                geoImageNetStore={geoImageNetStore}
                userInteractions={userInteractions}
                t={t}
              />
            </Collapse>
          )
          : null}
      </StyledList>
    );
  }
}

const component = compose(
  withTranslation(),
  withTaxonomyStore,
  withUserInterfaceStore,
)(PresentationListElement);
export { component as PresentationListElement };
