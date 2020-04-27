// @flow strict

import React from 'react';
import { observer } from 'mobx-react';
import withStyles from '@material-ui/core/styles/withStyles';
import { PlatformListElement } from '../../Taxonomy/PlatformListElement';

import type { LeafClassGroup as LeafClassGroupEntity } from '../../../Types';
import type { UserInteractions } from '../../../domain';
import type { GeoImageNetStore } from '../../../model/store/GeoImageNetStore';

type Props = {
  class_group: LeafClassGroupEntity,
  userInteractions: UserInteractions,
  geoImageNetStore: GeoImageNetStore,
  classes: {
    root: {},
    span: {},
  },
};
const style = (theme) => ({
  root: {
    '& ul': {
      paddingLeft: theme.values.gutterMedium,
    },
  },
  span: {
    color: theme.colors.gray,
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
});

@observer
class LeafClassGroup extends React.Component<Props> {
  render() {
    const {
      class_group,
      classes,
      userInteractions,
      geoImageNetStore,
    } = this.props;
    return (
      <div className={classes.root}>
        <span className={classes.span}>{class_group.path}</span>
        {class_group.children.map((taxonomy_class, j) => (
          <PlatformListElement
            userInteractions={userInteractions}
            geoImageNetStore={geoImageNetStore}
            taxonomy_class={taxonomy_class}
            key={j}
          />
        ))}
      </div>
    );
  }
}

const component = withStyles(style)(LeafClassGroup);

export {
  component as LeafClassGroup,
};
