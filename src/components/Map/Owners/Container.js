// @flow strict

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { observer } from 'mobx-react';
import { TFunction } from 'react-i18next';
import { buttonStyle } from '../SharedStyles';
import { OwnerIcon } from './OwnerIcon';
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
    this.props.geoImageNetStore.toggleAnnotatorIdentifiers();
  };

  render() {
    const { t, geoImageNetStore } = this.props;
    return (
      <>
        <IconButton
          color={geoImageNetStore.showAnnotatorsIdentifiers ? 'primary' : 'secondary'}
          onClick={this.receiveClickEvent}
          style={buttonStyle}
        >
          <OwnerIcon />
        </IconButton>
      </>
    );
  }
}

const component = withTranslation()(Container);

export {
  component as Container,
};
