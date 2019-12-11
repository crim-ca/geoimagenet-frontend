// @flow strict

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Checkbox } from './Checkbox';
import { ReleaseButton } from './ReleaseButton';
import type { TaxonomyClass } from '../../model/TaxonomyClass';

type Props = {
  taxonomy_class: TaxonomyClass,
  invert_taxonomy_class_visibility: (TaxonomyClass) => void,
  release_handler: (Event) => Promise<void>,
  toggle_pinned_class: (TaxonomyClass) => void,
};

@observer
class TaxonomyClassActions extends Component<Props> {

  makeChangeHandler = (taxonomy_class: TaxonomyClass) => () => {
    this.props.invert_taxonomy_class_visibility(taxonomy_class);
  };

  makePinnedHandler = (taxonomy_class: TaxonomyClass) => () => {
    this.props.toggle_pinned_class(taxonomy_class);
  };

  render() {
    const {
      taxonomy_class,
      release_handler,
    } = this.props;
    const { pinned, visible, id } = taxonomy_class;
    return (
      <span className="actions">
        <Checkbox
          value={id}
          imageClass="checkbox eye"
          changeHandler={this.makeChangeHandler(taxonomy_class)}
          checked={visible}
        />
        <Checkbox
          value={id}
          imageClass="checkbox pin"
          changeHandler={this.makePinnedHandler(taxonomy_class)}
          checked={pinned}
        />
        <ReleaseButton onclick={release_handler} />
      </span>
    );
  }
}

export { TaxonomyClassActions };
