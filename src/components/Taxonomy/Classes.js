// @flow strict
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { PlatformListElement } from './PlatformListElement.js'
import type { TaxonomyClass } from '../../domain/entities'
import type { UserInteractions } from '../../domain'
import type { GeoImageNetStore } from '../../store/GeoImageNetStore'
import withStyles from '@material-ui/core/styles/withStyles'

type Props = {
  taxonomy_classes: TaxonomyClass[],
  user_interactions: UserInteractions,
  state_proxy: GeoImageNetStore,
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
})

@observer
class TaxonomyClasses extends Component<Props> {

  render() {
    return (
      <div className={this.props.classes.root}>
        {this.props.taxonomy_classes.map((taxonomy_class, i) => (
          <PlatformListElement key={i}
                               taxonomy_class={taxonomy_class}
                               state_proxy={this.props.state_proxy}
                               user_interactions={this.props.user_interactions} />
        ))}
      </div>
    )
  }
}

const component = withStyles(style)(TaxonomyClasses)
export { component as Classes }
