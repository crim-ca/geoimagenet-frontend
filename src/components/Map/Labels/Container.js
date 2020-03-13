// @flow strict

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { observer } from 'mobx-react';
import { TFunction } from 'react-i18next';
import { buttonStyle } from '../SharedStyles';
import { LabelIcon } from './LabelIcon';
import { withTranslation } from '../../../utils';
import { GeoImageNetStore } from '../../../model/store/GeoImageNetStore';

type Props = {
  t: TFunction,
  geoImageNetStore: GeoImageNetStore,
};
type State = {};

@observer
class Container extends React.Component<Props, State> {
  receiveClickEvent = () => {
    this.props.geoImageNetStore.toggleLabels();
  };

  render() {
    const { t, geoImageNetStore } = this.props;
    return (
      <>
        <IconButton
          color={geoImageNetStore.showLabels ? 'primary' : 'secondary'}
          onClick={this.receiveClickEvent}
          style={buttonStyle}
        >
          <LabelIcon />
        </IconButton>
      </>
    );
  }
}

const component = withTranslation()(Container);

export {
  component as Container,
};
