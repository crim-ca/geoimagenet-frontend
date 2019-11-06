// @flow strict
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { PlatformListElement } from './PlatformListElement.js';
import type { TaxonomyClass } from '../../domain/entities';
import type { UserInteractions } from '../../domain';
import type { GeoImageNetStore } from '../../model/GeoImageNetStore';
import withStyles from '@material-ui/core/styles/withStyles';

type Props = {
  taxonomy_classes: TaxonomyClass[],
  userInteractions: UserInteractions,
  geoImageNetStore: GeoImageNetStore,
  classes: {
    root: {},
  },
};
const style = theme => ({
  root: {
    '& ul': {
      paddingLeft: theme.values.gutterMedium,
    },
  },
});

@observer
class TaxonomyClasses extends Component<Props> {

  render() {
    return (
      <div className={this.props.classes.root}>
        {this.props.taxonomy_classes.map((taxonomy_class, i) => (
          <PlatformListElement key={i}
                               taxonomy_class={taxonomy_class}
                               geoImageNetStore={this.props.geoImageNetStore}
                               userInteractions={this.props.userInteractions} />
        ))}
      </div>
    );
  }
}

const component = withStyles(style)(TaxonomyClasses);
export { component as Classes };
