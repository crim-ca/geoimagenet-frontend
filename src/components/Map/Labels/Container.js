// @flow strict

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { observer } from 'mobx-react';
import { TFunction } from 'react-i18next';
import { buttonStyle } from '../SharedStyles';
import { withTranslation } from '../../../utils';
import { GeoImageNetStore } from '../../../model/store/GeoImageNetStore';
import Label from '../../../img/icons/label_filled.png';
import LabelWhite from '../../../img/icons/label_filled_white.png';

type Props = {
  t: TFunction,
  geoImageNetStore: GeoImageNetStore,
};
type State = {};
const styles = {
  icon: {
    width: 48,
    height: 48,
    textAlign: 'center',
  },
};

@observer
class Container extends React.Component<Props, State> {
  receiveClickEvent = () => {
    this.props.geoImageNetStore.toggleLabels();
  };

  render() {
    const { t, geoImageNetStore } = this.props;
    return (
      <React.Fragment>
        <IconButton
          color="primary"
          onClick={this.receiveClickEvent}
          style={buttonStyle}
        >
          <img
            style={styles.icon}
            src={geoImageNetStore.showLabels ? Label : LabelWhite}
          />
        </IconButton>
      </React.Fragment>
    );
  }
}

const component = withTranslation()(Container);

export {
  component as Container,
};
