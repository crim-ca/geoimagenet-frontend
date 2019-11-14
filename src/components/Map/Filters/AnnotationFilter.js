// @flow strict

import React from 'react';
import { observer } from 'mobx-react';
import { TFunction } from 'react-i18next';
import { withTranslation } from '../../../utils';
import { CheckboxLineInput } from './CheckboxLineInput';
import type { AnnotationFilter as AnnotationFilterEntity } from '../../../model/AnnotationFilter';

type Props = {
  filter: AnnotationFilterEntity,
  t: TFunction,
};

@observer
class AnnotationFilter extends React.Component<Props> {
  toggleFilterActivation = (filter: AnnotationFilterEntity) => (event) => {
    if (filter.enabled) {
      filter.toggleActivated(event.target.checked);
    }
  };

  render() {
    const { filter, t } = this.props;
    const uniqueInputId = `filter_${filter.text}`;
    return (
      <li>
        <CheckboxLineInput
          uniqueId={uniqueInputId}
          checked={filter.activated}
          changeHandler={this.toggleFilterActivation(filter)}
          label={t(`status:plural.${filter.text}`)}
        />
      </li>
    );
  }
}

const component = withTranslation()(AnnotationFilter);

export { component as AnnotationFilter };
