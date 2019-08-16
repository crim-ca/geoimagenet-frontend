// @flow

import {observer} from "mobx-react";
import React, {Component} from "react";
import {Checkbox} from './Checkbox';
import {ReleaseButton} from './ReleaseButton';
import {TaxonomyClass} from "../../domain/entities";

type Props = {
    taxonomy_class: TaxonomyClass,
    invert_taxonomy_class_visibility: Function,
    release_handler: Function,
};

@observer
class TaxonomyClassActions extends Component<Props> {

    make_change_handler(taxonomy_class: TaxonomyClass) {
        return () => {
            this.props.invert_taxonomy_class_visibility(taxonomy_class);
        };
    }

    render() {
        return (
            <span className='actions'>
                <Checkbox value={this.props.taxonomy_class.id}
                          change_handler={this.make_change_handler(this.props.taxonomy_class)}
                          checked={this.props.taxonomy_class.visible} />
                <ReleaseButton onclick={this.props.release_handler} />
            </span>
        );
    }
}

export {TaxonomyClassActions};
