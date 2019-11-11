// @flow strict

import React from 'react';
import { PlatformListElement } from '../../Taxonomy/PlatformListElement';
import { observer } from 'mobx-react';
import withStyles from '@material-ui/core/styles/withStyles';

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
const style = theme => ({
  root: {
    '& ul': {
      paddingLeft: theme.values.gutterMedium,
    }
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
    const { class_group, classes } = this.props;
    return (
      <div className={classes.root}>
        <span className={classes.span}>{class_group.path}</span>
        {class_group.children.map((taxonomy_class, j) => (
          <PlatformListElement userInteractions={this.props.userInteractions}
                               geoImageNetStore={this.props.geoImageNetStore}
                               taxonomy_class={taxonomy_class}
                               key={j} />
        ))}
      </div>
    );
  }
}

const component = withStyles(style)(LeafClassGroup);

export {
  component as LeafClassGroup,
};
