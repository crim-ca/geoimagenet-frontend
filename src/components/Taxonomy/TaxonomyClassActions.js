// @flow strict

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Checkbox } from './Checkbox';
import { ReleaseButton } from './ReleaseButton';
import { TaxonomyClass } from '../../domain/entities';

type Props = {
  taxonomy_class: TaxonomyClass,
  invert_taxonomy_class_visibility: (TaxonomyClass) => void,
  release_handler: (Event) => Promise<void>,
  toggle_pinned_class: (TaxonomyClass) => void,
};

@observer
class TaxonomyClassActions extends Component<Props> {

  make_change_handler = (taxonomy_class: TaxonomyClass) => () => {
    this.props.invert_taxonomy_class_visibility(taxonomy_class);
  };

  make_pinned_handler = (taxonomy_class: TaxonomyClass) => () => {
    this.props.toggle_pinned_class(taxonomy_class);
  };

  render() {
    const { pinned, visible, id } = this.props.taxonomy_class;
    return (
      <span className='actions'>
                <Checkbox value={id}
                          image_class='checkbox eye'
                          change_handler={this.make_change_handler(this.props.taxonomy_class)}
                          checked={visible} />
                <Checkbox value={id}
                          image_class='checkbox pin'
                          change_handler={this.make_pinned_handler(this.props.taxonomy_class)}
                          checked={pinned} />
                <ReleaseButton onclick={this.props.release_handler} />
            </span>
    );
  }
}

export { TaxonomyClassActions };
