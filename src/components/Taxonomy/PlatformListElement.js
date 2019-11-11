// @flow strict
import { observer } from 'mobx-react';
import {
  Collapse,
  List,
  ListItem,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import type { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';
import { withTranslation } from '../../utils';
import { AnnotationCounts } from './AnnotationCounts';
import { TaxonomyClassActions } from './TaxonomyClassActions';
import { Classes } from './Classes';
import { ANNOTATION } from '../../constants';
import type { TaxonomyClass } from '../../domain/entities';
import type { UserInteractions } from '../../domain';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';
import { withTaxonomyStore, withUserInterfaceStore } from '../../model/HOCs';
import type { UserInterfaceStore } from '../../model/store/UserInterfaceStore';

const StyledListItem = withStyles({
  root: {
    padding: '4px',
    justifyContent: 'space-between',
  },
})(ListItem);
const StyledList = withStyles({
  padding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
})(List);
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
  userInteractions: UserInteractions,
  taxonomyStore: TaxonomyStore,
  geoImageNetStore: GeoImageNetStore,
  uiStore: UserInterfaceStore,
  t: TFunction,
};

/**
 * The PlatformListElement element is an entry in the taxonomy classes list,
 * as well as any children the class might have.
 * It should allow for toggling of visibility for its classes,
 * as well as releasing new annotations that are currently pending for that class.
 */
@observer
class PlatformListElement extends React.Component<Props> {
  /**
   * Create the click handler with the relevant class entity
   */
  toggleListElementCallback = (taxonomyClass: TaxonomyClass) => () => {
    const { taxonomyStore: { toggle_taxonomy_class_tree_element } } = this.props;
    toggle_taxonomy_class_tree_element(taxonomyClass);
  };

  releaseCallback = (taxonomyClass: TaxonomyClass) => async (event: Event) => {
    const { userInteractions: { release_annotations, refresh_source_by_status } } = this.props;
    event.stopPropagation();
    await release_annotations(taxonomyClass.id);
    refresh_source_by_status(ANNOTATION.STATUS.NEW);
    refresh_source_by_status(ANNOTATION.STATUS.RELEASED);
  };

  makeSelectTaxonomyClassForAnnotationHandler = (taxonomyClass: TaxonomyClass) => () => {
    const { taxonomyStore: { select_taxonomy_class } } = this.props;
    select_taxonomy_class(taxonomyClass);
  };

  render() {
    const {
      taxonomy_class,
      geoImageNetStore,
      taxonomyStore: {
        toggle_pinned_class,
        invert_taxonomy_class_visibility,
        selected_taxonomy_class_id,
      },
      uiStore,
      userInteractions,
      t,
    } = this.props;
    const { children } = taxonomy_class;

    const labelClickCallback = children && children.length > 0
      ? this.toggleListElementCallback(taxonomy_class)
      : this.makeSelectTaxonomyClassForAnnotationHandler(taxonomy_class);

    return (
      <StyledList>
        <StyledListItem
          className="taxonomy_class_list_element"
          onClick={labelClickCallback}
          selected={selected_taxonomy_class_id === taxonomy_class.id}
          button
        >
          <StyledLabelAndCountSpan>
            <span>{t(`taxonomy_classes:${taxonomy_class.id}`)}</span>
            <AnnotationCounts
              name_en={taxonomy_class.name_en}
              counts={taxonomy_class.counts}
              annotationStatusFilters={uiStore.annotationStatusFilters} />
          </StyledLabelAndCountSpan>
          <TaxonomyClassActions
            taxonomy_class={taxonomy_class}
            release_handler={this.releaseCallback(taxonomy_class)}
            toggle_pinned_class={toggle_pinned_class}
            invert_taxonomy_class_visibility={invert_taxonomy_class_visibility}
          />
        </StyledListItem>
        {children
          ? (
            <Collapse in={taxonomy_class.opened}>
              <Classes
                taxonomy_classes={children}
                geoImageNetStore={geoImageNetStore}
                userInteractions={userInteractions}
              />
            </Collapse>
          ) : null}
      </StyledList>
    );
  }
}

const component = compose(
  withTaxonomyStore,
  withUserInterfaceStore,
  withTranslation(),
)(PlatformListElement);

export { component as PlatformListElement };
